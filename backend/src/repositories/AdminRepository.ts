import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UserFilters {
  page: number;
  limit: number;
  role?: string;
  search?: string;
}

interface PropertyFilters {
  page: number;
  limit: number;
  status?: string;
  propertyType?: string;
}

interface ReportFilters {
  type: string;
  startDate?: string;
  endDate?: string;
}

export class AdminRepository {
  async getDashboardStats() {
    const [
      totalUsers,
      totalProperties,
      activeProperties,
      totalFavorites,
      usersByRole,
      propertiesByType,
      recentUsers,
      recentProperties,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.property.count({ where: { status: "ACTIVE" } }),
      prisma.favorite.count(),
      prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
      prisma.property.groupBy({
        by: ["propertyType"],
        _count: { propertyType: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      overview: {
        totalUsers,
        totalProperties,
        activeProperties,
        totalFavorites,
      },
      usersByRole: usersByRole.map((item) => ({
        role: item.role,
        count: item._count.role,
      })),
      propertiesByType: propertiesByType.map((item) => ({
        type: item.propertyType,
        count: item._count.propertyType,
      })),
      recentUsers,
      recentProperties,
    };
  }

  async getAllUsers(filters: UserFilters) {
    const { page, limit, role, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isEmailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: {
              properties: true,
              favorites: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: string, role: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async suspendUser(userId: string) {
    // For now, we'll just return the user
    // In a real implementation, you'd add a suspended field
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async getAllProperties(filters: PropertyFilters) {
    const { page, limit, status, propertyType } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updatePropertyStatus(propertyId: string, status: string) {
    return await prisma.property.update({
      where: { id: propertyId },
      data: { status: status as any },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteProperty(propertyId: string) {
    return await prisma.property.delete({
      where: { id: propertyId },
    });
  }

  async getReports(filters: ReportFilters) {
    const { type, startDate, endDate } = filters;

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    switch (type) {
      case "users":
        return await this.getUsersReport(dateFilter);
      case "properties":
        return await this.getPropertiesReport(dateFilter);
      case "activity":
        return await this.getActivityReport(dateFilter);
      default:
        throw new Error("Invalid report type");
    }
  }

  private async getUsersReport(dateFilter: any) {
    const where =
      dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {};

    const [totalUsers, usersByRole, usersByMonth] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.groupBy({
        by: ["role"],
        where,
        _count: { role: true },
      }),
      prisma.user.groupBy({
        by: ["createdAt"],
        where,
        _count: { createdAt: true },
      }),
    ]);

    return {
      totalUsers,
      usersByRole: usersByRole.map((item) => ({
        role: item.role,
        count: item._count.role,
      })),
      usersByMonth,
    };
  }

  private async getPropertiesReport(dateFilter: any) {
    const where =
      dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {};

    const [totalProperties, propertiesByType, propertiesByStatus] =
      await Promise.all([
        prisma.property.count({ where }),
        prisma.property.groupBy({
          by: ["propertyType"],
          where,
          _count: { propertyType: true },
        }),
        prisma.property.groupBy({
          by: ["status"],
          where,
          _count: { status: true },
        }),
      ]);

    return {
      totalProperties,
      propertiesByType: propertiesByType.map((item) => ({
        type: item.propertyType,
        count: item._count.propertyType,
      })),
      propertiesByStatus: propertiesByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
    };
  }

  private async getActivityReport(dateFilter: any) {
    const where =
      dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {};

    const [newUsers, newProperties, newFavorites] = await Promise.all([
      prisma.user.count({ where }),
      prisma.property.count({ where }),
      prisma.favorite.count({ where }),
    ]);

    return {
      newUsers,
      newProperties,
      newFavorites,
    };
  }
}
