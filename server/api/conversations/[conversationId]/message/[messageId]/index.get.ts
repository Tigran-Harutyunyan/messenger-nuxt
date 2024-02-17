import prisma from "../../../../../../libs/prismadb";

export default defineEventHandler(async (event) => {

    const { messageId, conversationId } = event.context.params;

    try {
        const message = await prisma.message.findUnique({
            where: {
                conversationId: conversationId as string,
                id: messageId as string
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
