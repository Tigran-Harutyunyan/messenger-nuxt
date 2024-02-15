
import { type FullConversationType } from "@/types";
import { type User } from "@prisma/client";

export const useOtherUser = (conversation: FullConversationType | { users: User[] }, session: any) => {

    const otherUser = computed(() => {
        if (!conversation) return null;
        const currentUserEmail = session?.value?.user?.email;

        const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);

        return otherUser[0];
    });

    return otherUser;
};
