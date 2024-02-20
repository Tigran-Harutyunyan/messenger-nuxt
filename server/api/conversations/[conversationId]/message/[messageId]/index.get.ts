import prisma from "../../../../../../libs/prismadb";

export default defineEventHandler(async (event) => {

    const params = event.context.params;

    try {
        const message = await prisma.message.findUnique({
            where: {
                conversationId: params?.conversationId as string,
                id: params?.messageId as string
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
