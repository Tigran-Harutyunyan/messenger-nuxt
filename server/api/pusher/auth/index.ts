import { getServerSession } from '#auth';
import { pusherServer } from "@/libs/pusher";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session?.user?.email) {
    throw createError({
      statusCode: 401
    });
  }

  const { socket_id: socketId, channel_name: channel } = await readBody(event);

  const data = {
    user_id: session.user.email,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  return authResponse;
});
