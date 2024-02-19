import type { Conversation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User,
  seen: User[]
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[]
};

export interface eventMessage {
  i: String
  b: string
  c: Date
  si: string
  se: {
    n: string
    e: string
    im: string
  };
}

export interface eventConversation {
  i: string
  m: eventMessage;
}

export interface eventNewConversation {
  i: string
  ig: boolean,
  n: string,
  u: string[]
}

interface uiUser {
  id: string
  name: string
  email: string
  image: string
}

interface uiMessage {
  id: string
  name: string
  email: string
  image: string
}

export interface uiConversationType {
  id: string;
  createdAt: Date;
  name: string | null;
  isGroup: boolean | null;
  userIds: string[];
  users: uiUser[],
  messages: uiMessage & {
    seen: []
  }
}