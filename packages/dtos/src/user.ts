import { z } from "zod";

export type User = {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthenticateUserResponse = {
  access_token: string;
};

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type AuthenticateUserSchema = z.infer<typeof authenticateUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UpdateUsernameSchema = z.infer<typeof updateUsernameSchema>;

export const createUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const authenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string(),
});

export const updateUsernameSchema = z.object({
  username: z.string(),
});
