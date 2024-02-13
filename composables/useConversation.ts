export const useConversation = () => {

    const conversationId = computed(() => {

        if (!useRoute().params?.conversationId) {
            return '';
        }

        return useRoute().params?.conversationId as string;
    });

    const isOpen = computed(() => !!conversationId.value);

    return {
        isOpen,
        conversationId
    };
};

export default useConversation;