import { Link, Outlet, useLocation } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

export default function ProfileLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div>
      <h2 className="mt-6 text-2xl font-medium tracking-tight">Perfil</h2>

      <Separator className="my-6" />

      <div className="flex space-x-12">
        <aside className="w-1/5">
          <nav className="flex flex-col space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === link.href
                    ? "bg-gray-200 hover:bg-gray-200"
                    : "hover:bg-transparent hover:underline",
                  "justify-start"
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const links = [
  {
    title: "Informações",
    href: "/profile",
  },
];
