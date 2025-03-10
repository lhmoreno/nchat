import { api } from "~/lib/axios";

import {
  CreateMessageResponse,
  CreateMessageSchema,
} from "@nchat/dtos/message";

export async function sendMessage(data: CreateMessageSchema) {
  const { data: message } = await api.post<CreateMessageResponse>(
    "/messages",
    data
  );

  return message;
}
