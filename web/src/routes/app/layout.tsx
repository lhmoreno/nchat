import { Outlet, redirect } from "react-router";

export async function clientLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }

  return { token };
}

export default function AppLayout() {
  return (
    <main className="">
      <Outlet />
    </main>
  );
}
