import { z } from "zod";

export type Chat = {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
};

export type CreateChatResponse = {
  id: string;
};

export type CreateChatSchema = z.infer<typeof createChatSchema>;

export const createChatSchema = z.object({
  receiveId: z.string(),
});
