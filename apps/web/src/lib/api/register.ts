import { api } from "~/lib/axios";
import { CreateUserSchema } from "@nchat/dtos/user";

export async function register(data: CreateUserSchema) {
  await api.post("/users", data);
}
