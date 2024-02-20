import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge';
import type { FullConversationType, FullMessageType, eventConversation, eventNewConversation } from "@/types";
import { type User } from "@prisma/client";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenMessage(message: FullMessageType) {
  return {
    i: message.id as string,
    b: message.body as string,
    c: message.createdAt as Date,
    im: message.image as string,
    si: message.senderId as string,
    se: {
      n: message?.sender?.name as string,
      e: message?.sender?.email as string,
      im: message?.sender?.image as string
    }
  }
}

export function shortenConversation(conversation: Omit<FullConversationType, 'messages'>) {
  return {
    i: conversation.id as string,
    ig: conversation.isGroup as boolean,
    n: conversation.name as string,
    u: conversation.userIds
  }
}

export function getTransformedConversation(payload: eventConversation) {
  const {
    i: cid,
    m: {
      i,
      b: body,
      im: msgImage,
      c: createdAt,
      si: senderId,
      se: { n: name, e: email, im: image },
    },
  } = payload;

  return {
    id: cid,
    message: {
      id: i,
      body,
      image: msgImage,
      createdAt,
      senderId,
      conversationId: cid,
      seen: [],
      seenIds: [],
      sender: {
        id: senderId,
        name,
        email,
        image,
        emailVerified: null,
        seenMessageIds: [],
        conversationIds: [],
        updatedAt: "",
      },
    },
  };
};


export function getTransformedNewConversation(payload: eventNewConversation, currentUser: User, users: User[]) {
  // events come with miimum payload in order to avoid 413 error.need to transform to usable form.
  const { i: id, ig: isGroup, n: name, u: userIds } = payload;

  const newUsers = users
    ?.filter((user) => userIds.includes(user.id))
    .map((user) => {
      return {
        id: user.id,
        image: user.image,
        name: user.name,
      };
    });
  const data = {
    id,
    name,
    isGroup,
    users: [...newUsers],
  };
  data.users.push(currentUser)
  return data;
};