import { getServerSession } from '#auth';
import prisma from "@/libs/prismadb";
export default defineEventHandler(async (event) => {

    const { conversationId } = getQuery(event);

    const session = await getServerSession(event);

    if (!session?.user?.email) {
        return null;
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId as string
            },
            include: {
                sender: true,
                seen: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return messages;
    } catch (error: any) {
        return [];
    }

});
