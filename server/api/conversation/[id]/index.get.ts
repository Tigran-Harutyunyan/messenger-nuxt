import { getServerSession } from '#auth';
import prisma from "../../../../libs/prismadb";

export default defineEventHandler(async (event) => {

    const { id } = event.context.params;

    const session = await getServerSession(event);

    if (!session?.user?.email) {
        return null;
    }

    try {
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: id as string
            },
            include: {
                users: true,
            },
        });

        return conversation;
    } catch (error: any) {
        return null;
    }

});
