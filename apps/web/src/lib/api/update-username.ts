import { api } from "~/lib/axios";
import { UpdateUsernameSchema } from "@nchat/dtos/user";

export async function updateUsername(data: UpdateUsernameSchema) {
  await api.patch("/users/username", data);
}
