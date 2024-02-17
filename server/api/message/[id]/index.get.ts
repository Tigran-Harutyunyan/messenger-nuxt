import prisma from "../../../../libs/prismadb";
export default defineEventHandler(async (event) => {

    const { conversationId } = getQuery(event);
    const { id } = event.context.params;

    try {
        const messages = await prisma.message.findUnique({
            where: {
                conversationId: conversationId as string,
                id: id as string
            },
            include: {
                sender: true,
                seen: true,
            }
        });

        return messages;
    } catch (error: any) {
        return [];
    }

});
