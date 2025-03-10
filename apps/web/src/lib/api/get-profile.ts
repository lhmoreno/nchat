import { api } from "~/lib/axios";
import { User } from "@nchat/dtos/user";

export async function getProfile() {
  const { data } = await api.get<User>("/me");

  return data;
}
