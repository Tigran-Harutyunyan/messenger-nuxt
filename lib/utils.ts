import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge';
import type { FullConversationType, FullMessageType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenMessage(message: FullMessageType) {
  return {
    i: message.id as string,
    b: message.body as string,
    c: message.createdAt as Date,
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