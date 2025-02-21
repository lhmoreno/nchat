import { Link, Outlet, useLocation } from "react-router";
import { Separator } from "~/components/ui/separator";
import { API, Chats } from "~/lib/api";
import { cn } from "~/lib/utils";

export async function clientLoader() {
  const res = await API.getChats();

  if (res.error) {
    console.error(res.error);
    return [];
  }

  return res.body;
}

export default function Chats({ loaderData: chats }: { loaderData: Chats }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="mt-4 h-chat flex rounded-lg border bg-card text-card-foreground shadow-sm">
      <aside className="w-1/5">
        <nav className="flex flex-col p-2">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              to={`/chats/${chat.id}`}
              className={cn(
                "px-4 py-2 rounded-lg hover:bg-gray-100",
                pathname === `/chats/${chat.id}` &&
                  "bg-gray-200 hover:bg-gray-200"
              )}
            >
              <strong>{chat.user.name}</strong>
              <p className="text-sm text-gray-600">{`@${chat.user.username}`}</p>
            </Link>
          ))}
        </nav>
      </aside>
      <Separator orientation="vertical" />
      <Outlet />
    </div>
  );
}
