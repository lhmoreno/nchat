import { Outlet, redirect } from "react-router";

export async function clientLoader() {
  const token = localStorage.getItem("token");

  if (token) {
    return redirect("/");
  }

  return {};
}

export default function AuthLayout() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <Outlet />
    </main>
  );
}
