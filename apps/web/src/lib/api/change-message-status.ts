import { api } from "~/lib/axios";

import { UpdateMessageStatusSchema } from "@nchat/dtos/message";

export async function changeMessageStatus(
  messageId: string,
  data: UpdateMessageStatusSchema
) {
  await api.patch(`/messages/${messageId}/status`, data);
}
