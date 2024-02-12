export const useConversation = () => {
    const params = useRoute().query;

    const conversationId = computed(() => {
        if (params?.conversationId) {
            return '';
        }

        return params?.conversationId as string;
    });

    const isOpen = computed(() => !!conversationId.value);

    return {
        isOpen,
        conversationId
    };
};

export default useConversation;