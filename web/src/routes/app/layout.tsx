import { Outlet, redirect } from "react-router";
import { Header } from "./header";

export async function clientLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }

  return { token };
}

export default function AppLayout() {
  return (
    <div>
      <Header />

      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
