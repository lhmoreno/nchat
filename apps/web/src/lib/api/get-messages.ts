import { api } from "~/lib/axios";
import { Message } from "@nchat/dtos/message";

export async function getMessages(chatId: string) {
  const { data } = await api.get<Message[]>(`/chats/${chatId}/messages`);

  return data;
}
