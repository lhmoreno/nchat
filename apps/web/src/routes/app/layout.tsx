import { Outlet, redirect, useNavigate } from "react-router";
import { Header } from "./header";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "~/lib/api/get-profile";
import { useEffect } from "react";

export async function clientLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }
}

export default function AppLayout() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (!isLoading && !profile) {
      navigate("/login");
    }
  }, [profile, isLoading]);

  if (isLoading || !profile) {
    return null;
  }

  return (
    <div>
      <Header profile={profile} />

      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
