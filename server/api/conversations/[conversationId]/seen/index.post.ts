import { getServerSession } from '#auth'
import prisma from "../../../../../libs/prismadb";
import { pusherServer } from "../../../../../libs/pusher";
import getCurrentUser from "@/actions/getCurrentUser";
import { triggerChunked } from "@/lib/utils";

export default defineEventHandler(async (event) => {
    const { conversationId } = getRouterParams(event)


    const session = await getServerSession(event);

    if (!session?.user?.email) {
        return null;
    }

    const currentUser = await getCurrentUser(event);


    if (!currentUser?.id || !currentUser?.email) {
        throw createError({
            statusCode: 400,
        });
    }

    // Find existing conversation
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            messages: {
                include: {
                    seen: true
                },
            },
            users: true,
        },
    });

    if (!conversation) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid ID"
        })
    }

    // Find last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
        return conversation;
    }

    // Update seen of last message
    const updatedMessage = await prisma.message.update({
        where: {
            id: lastMessage.id
        },
        include: {
            sender: true,
            seen: true,
        },
        data: {
            seen: {
                connect: {
                    id: currentUser.id
                }
            }
        }
    });

    // Update all connections with new seen  
    triggerChunked(pusherServer, currentUser.email, "conversation-message", {
        id: conversationId,
        messages: [updatedMessage]
    });

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
        return conversation;
    }

    // Update last message seen
    triggerChunked(pusherServer, conversationId!, "message:update", updatedMessage);

    return 'Success';
});
