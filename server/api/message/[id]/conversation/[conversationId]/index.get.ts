import prisma from "@/libs/prismadb";

export default defineEventHandler(async (event) => {

    const { id, conversationId } = event.context.params;

    try {
        const message = await prisma.message.findUnique({
            where: {
                conversationId: conversationId as string,
                id: id as string
            },
            include: {
                sender: true,
                seen: true,
            }
        });

        return message;
    } catch (error: any) {
        return null
    }

});
