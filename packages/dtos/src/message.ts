import { z } from "zod";

export type Message = {
  id: string;
  senderId: string;
  content: string;
  status: "sent" | "delivered" | "read";
  createdAt: string;
};

export type CreateMessageResponse = {
  id: string;
  createdAt: string;
  status: "sent" | "delivered" | "read";
};

export type CreateMessageSchema = z.infer<typeof createMessageSchema>;
export type UpdateMessageStatusSchema = z.infer<
  typeof updateMessageStatusSchema
>;

export const createMessageSchema = z.object({
  chatId: z.string(),
  content: z.string(),
});

export const updateMessageStatusSchema = z.object({
  status: z.enum(["delivered", "read"]),
});
