import { Route } from "./+types/profile";
import { API, Profile } from "~/lib/api";
import UpdateProfileForm from "./update-profile-form";
import UpdateUsernameForm from "./update-username";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Perfil | nChat" }];
}

export async function clientLoader() {
  const res = await API.getProfile();

  if (!res.profile) {
    console.error(res.error);
    return {};
  }

  return res.profile;
}

export default function Profile({
  loaderData: profile,
}: {
  loaderData: Profile;
}) {
  return (
    <div className="space-y-6">
      {/* <UploadImage /> */}
      <UpdateProfileForm profile={profile} />
      <UpdateUsernameForm profile={profile} />
    </div>
  );
}
