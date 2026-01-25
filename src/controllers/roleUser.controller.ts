import prisma from "../prisma/client";

const createUserLogin = async (userId: string) => {
  try {
    const findRole = await prisma.role.findFirst({
      where: { name: "USER" },
    });

    if (!findRole) {
      throw new Error("USER role not found");
    }
    const createUser = await prisma.userRole.create({
      data: { userId, roleId: findRole.id },
    });

    return createUser;
  } catch (error) {
    console.error("createUserLogin error:", error);
    throw error;
  }
};

export { createUserLogin };
