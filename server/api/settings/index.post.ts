
import prisma from "@/libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import { pusherServer } from "@/libs/pusher";

export default defineEventHandler(async (event) => {

    const currentUser = await getCurrentUser(event);

    if (!currentUser?.id) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized"
        })
    }

    try {

        const body = await readBody(event);
        const {
            name,
            image,
        } = body;

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                image: image,
                name: name
            },
        });


        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        });

        users.map(async (user) => {
            if (user?.email) {
                await pusherServer.trigger(user?.email!, 'update:profile', {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    image: updatedUser.image
                });
            }
        });

        return updatedUser;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Something went wrong"
        })
    }

});
