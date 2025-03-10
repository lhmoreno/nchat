import { api } from "~/lib/axios";
import { Chat } from "@nchat/dtos/chat";

export async function getChats() {
  const { data } = await api.get<Chat[]>("/chats");

  return data;
}
