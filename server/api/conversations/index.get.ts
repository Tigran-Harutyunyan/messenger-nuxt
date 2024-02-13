import { getServerSession } from '#auth';
import prisma from "../../../libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export default defineEventHandler(async (event) => {

    const session = await getServerSession(event);

    if (!session?.user?.email) {
        return null;
    }
    const currentUser = await getCurrentUser(event);

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc',
            },
            where: {
                userIds: {
                    has: currentUser.id
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
