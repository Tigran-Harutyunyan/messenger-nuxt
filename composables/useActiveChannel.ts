import { useActiveListStore } from "@/stores/useActiveListStore";
import type { Channel, Members } from "pusher-js";


export const useActiveChannel = (pusherClient) => {
    const { add, remove, set } = useActiveListStore();

    const activeChannel = ref<Channel | null>(null);

    onMounted(() => {

        let channel = activeChannel.value;

        if (!channel) {
            channel = pusherClient.subscribe('presence-messenger');
            activeChannel.value = channel;
        }

        channel?.bind("pusher:subscription_succeeded", (members: Members) => {
            const initialMembers: string[] = [];

            members.each((member: Record<string, any>) => initialMembers.push(member.id));
            set(initialMembers);
        });

        channel?.bind("pusher:member_added", (member: Record<string, any>) => {
            add(member.id)
        });

        channel?.bind("pusher:member_removed", (member: Record<string, any>) => {
            remove(member.id);
        });
    })

    onUnmounted(() => {
        if (activeChannel.value) {
            pusherClient.unsubscribe('presence-messenger');
            activeChannel.value = null;
        }
    })

};

