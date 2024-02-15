import { getServerSession } from '#auth'
import { pusherServer } from "../../../libs/pusher";
import prisma from "../../../libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);

    const {
        userId,
        isGroup,
        members,
        name
    } = await readBody(event);

    if (!session?.user?.email) {
        return null;
    }

    const currentUser = await getCurrentUser(event);


    if (!currentUser?.id) {
        throw createError({
            statusCode: 400,
        });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
        throw createError({
            statusCode: 400,
        });
    }

    if (isGroup) {
        const newConversation = await prisma.conversation.create({
            data: {
                name,
                isGroup,
                users: {
                    connect: [
                        ...members.map((member: { value: string }) => ({
                            id: member.value
                        })),
                        {
                            id: currentUser.id
                        }
                    ]
                }
            },
            include: {
                users: true,
            }
        });


        // Update all connections with new conversation
        newConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:new', newConversation);
            }
        });

        return newConversation;
    }

    const existingConversations = await prisma.conversation.findMany({
        where: {
            OR: [
                {
                    userIds: {
                        equals: [currentUser.id, userId]
                    }
                },
                {
                    userIds: {
                        equals: [userId, currentUser.id]
                    }
                }
            ]
        }
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
        return singleConversation;
    }

    const newConversation = await prisma.conversation.create({
        data: {
            users: {
                connect: [
                    {
                        id: currentUser.id
                    },
                    {
                        id: userId
                    }
                ]
            }
        },
        include: {
            users: true
        }
    });

    // Update all connections with new conversation
    newConversation.users.map((user) => {
        if (user.email) {
            pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
    });


    return newConversation;
});
