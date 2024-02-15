import prisma from "../../../libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export default defineEventHandler(async (event) => {

    const currentUser = await getCurrentUser(event);

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc',
            },
            where: {
                userIds: {
                    has: currentUser?.id
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true,
                    }
                },
            }
        });

        return conversations;
    } catch (error: any) {
        return [];
    }


});
