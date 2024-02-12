// const { signOut } = useAuth();

import HiChat from '@/components/ui/icons/HiChat.vue';
import HiUsers from '@/components/ui/icons/HiUsers.vue';
import HiArrowLeftOnRectangle from '@/components/ui/icons/HiArrowLeftOnRectangle.vue';

import useConversation from "./useConversation";

export const useRoutes = () => {

    const { conversationId } = useConversation();
    const params = useRoute();

    const routes = computed(() => [
        {
            label: 'Chat',
            href: '/conversations',
            icon: HiChat,
            active: params.name === 'conversations' //|| !!conversationId
        },
        {
            label: 'Users',
            href: '/users',
            icon: HiUsers,
            active: params.name === 'users'
        },
        {
            label: 'Logout',
            //onClick: () => signOut(),
            href: '#',
            icon: HiArrowLeftOnRectangle,
        }
    ]);

    return routes;
};
