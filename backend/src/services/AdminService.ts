import { AdminRepository } from "../repositories/AdminRepository";

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

export class AdminService {
  private adminRepository = new AdminRepository();

  async getDashboardStats() {
    return await this.adminRepository.getDashboardStats();
  }

  async getAllUsers(filters: UserFilters) {
    return await this.adminRepository.getAllUsers(filters);
  }

  async updateUserRole(userId: string, role: string) {
    // Validate role
    const validRoles = ["BUYER", "SELLER", "AGENT", "ADMIN"];
    if (!validRoles.includes(role)) {
      throw new Error("Invalid role specified");
    }

    return await this.adminRepository.updateUserRole(userId, role);
  }

  async suspendUser(userId: string, reason?: string) {
    // In a real app, you might want to add a suspended field to the user model
    // For now, we'll just log the action
    console.log(
      `User ${userId} suspended. Reason: ${reason || "No reason provided"}`
    );

    // You could implement this by adding a 'suspended' field to the User model
    // and updating the auth middleware to check for suspended users
    return await this.adminRepository.suspendUser(userId);
  }

  async getAllProperties(filters: PropertyFilters) {
    return await this.adminRepository.getAllProperties(filters);
  }

  async updatePropertyStatus(
    propertyId: string,
    status: string,
    reason?: string
  ) {
    const validStatuses = ["ACTIVE", "INACTIVE", "SOLD", "RENTED"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status specified");
    }

    return await this.adminRepository.updatePropertyStatus(propertyId, status);
  }

  async deleteProperty(propertyId: string, reason?: string) {
    console.log(
      `Property ${propertyId} deleted by admin. Reason: ${
        reason || "No reason provided"
      }`
    );
    return await this.adminRepository.deleteProperty(propertyId);
  }

  async getReports(filters: ReportFilters) {
    return await this.adminRepository.getReports(filters);
  }
}
