import { getServerSession } from '#auth'
import prisma from "../../../../libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import { pusherServer } from "../../../../libs/pusher";

export default defineEventHandler(async (event) => {
    const { conversationId } = getRouterParams(event);

    const session = await getServerSession(event);

    if (!session?.user?.email) {
        return null;
    }

    const currentUser = await getCurrentUser(event);

    if (!currentUser?.id) {
        throw createError({
            statusCode: 400,
        });
    }

    try {
        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        if (!existingConversation) {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid ID"
            })
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                },
            },
        });

        existingConversation.users.forEach(async (user) => {
            if (user.email) {
                await pusherServer.trigger(user.email, 'conversation:remove', existingConversation.id);
            }
        });

        existingConversation.users.forEach(async (user) => {
            // in vercel there is a delay for some cases
            if (user.email) {
                await pusherServer.trigger(user.email, 'dummy:message', existingConversation.id);
            }
        });

        return deletedConversation
    } catch (error) {
        return null;
    }


});
