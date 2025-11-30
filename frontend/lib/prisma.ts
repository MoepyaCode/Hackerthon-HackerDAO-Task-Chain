import "dotenv/config";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@/lib/generated/prisma";

const globalForPrisma = globalThis as unknown as {
	prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const createPrismaClient = () =>
	new PrismaClient({
		accelerateUrl: process.env.DATABASE_URL,
	}).$extends(withAccelerate());

export const prisma = (() => {
	if (!globalForPrisma.prisma) {
		globalForPrisma.prisma = createPrismaClient();
	}
	return globalForPrisma.prisma;
})();
