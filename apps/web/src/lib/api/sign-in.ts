import { api } from "~/lib/axios";
import {
  AuthenticateUserResponse,
  AuthenticateUserSchema,
} from "@nchat/dtos/user";

export async function signIn(data: AuthenticateUserSchema) {
  const {
    data: { access_token },
  } = await api.post<AuthenticateUserResponse>("/sessions", data);

  return { access_token };
}
