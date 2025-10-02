import prisma from "../config/database";

export class FavoritesRepository {
  async addFavorite(userId: string, propertyId: string) {
    return prisma.favorite.create({
      data: {
        userId,
        propertyId,
      },
      include: {
        property: true,
      },
    });
  }

  async removeFavorite(userId: string, propertyId: string) {
    return prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });
  }

  async getUserFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        property: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async isFavorite(userId: string, propertyId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });
    return !!favorite;
  }

  async getFavoriteCount(propertyId: string) {
    return prisma.favorite.count({
      where: { propertyId },
    });
  }
}
