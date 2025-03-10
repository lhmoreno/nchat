import { api } from "~/lib/axios";
import { UpdateUserSchema } from "@nchat/dtos/user";

export async function updateProfile(data: UpdateUserSchema) {
  await api.put("/users", data);
}
