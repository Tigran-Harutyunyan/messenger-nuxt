
import { getServerSession } from '#auth'
import { pusherServer } from "@/libs/pusher";
import prisma from "@/libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import { shortenMessage } from "@/lib/utils";

export default defineEventHandler(async (event) => {
    const {
        message,
        image,
        conversationId
    } = await readBody(event);

    const session = await getServerSession(event);

    const currentUser = await getCurrentUser(event);

    if (!session?.user?.email) {
        return null;
    }

    try {

        const newMessage = await prisma.message.create({
            include: {
                seen: true,
                sender: true
            },
            data: {
                body: message || "",
                image: image || "",
                conversation: {
                    connect: { id: conversationId }
                },
                sender: {
                    connect: { id: currentUser?.id }
                },
                seen: {
                    connect: {
                        id: currentUser?.id
                    }
                },
            }
        });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                        sender: true
                    }
                }
            }
        });

        await pusherServer.trigger(conversationId!, "message:new", shortenMessage(newMessage));

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        const payload = {
            i: conversationId,
            m: shortenMessage(lastMessage)
        }

        updatedConversation.users.map(async (user) => {
            await pusherServer.trigger(user.email!, "conversation:update", payload);
        });

        return newMessage;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Something went wrong"
        })
    }

});
