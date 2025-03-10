import { queryClient } from "~/lib/react-query";
import { Route } from "./+types/profile";
import UpdateProfileForm from "./update-profile-form";
import UpdateUsernameForm from "./update-username";
import { User } from "@nchat/dtos/user";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Perfil | nChat" }];
}

export default function Profile() {
  const profile = queryClient.getQueryData(["profile"]) as User;

  return (
    <div className="space-y-6">
      {/* <UploadImage /> */}
      <UpdateProfileForm profile={profile} />
      <UpdateUsernameForm profile={profile} />
    </div>
  );
}
