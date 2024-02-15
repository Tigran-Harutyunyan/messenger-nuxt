import PusherClient from 'pusher-js';

export default defineNuxtPlugin(async (nuxtApp) => {
  const pusherKey = useRuntimeConfig().public.pusherPublicAppKey as string;

  nuxtApp.pusherClient = new PusherClient(
    pusherKey,
    {
      channelAuthorization: {
        endpoint: '/api/pusher/auth',
        transport: 'ajax',
      },
      cluster: 'ap2',
    }
  );
});