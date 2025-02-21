import { Outlet, redirect } from "react-router";
import { Header } from "./header";
import { API, Profile } from "~/lib/api";

export async function clientLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }

  const res = await API.getProfile();

  if (!res.profile) {
    console.error(res.error);
    return {};
  }

  return res.profile;
}

export default function AppLayout({
  loaderData: profile,
}: {
  loaderData: Profile;
}) {
  return (
    <div>
      <Header profile={profile} />

      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
