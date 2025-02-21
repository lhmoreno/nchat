import { LogOutIcon, UserRoundIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Profile } from "~/lib/api";
import { cn, logOut } from "~/lib/utils";

const links = [
  { href: "/chats", title: "Conversas" },
  { href: "/profile", title: "Perfil" },
];

export function Header({ profile }: { profile: Profile }) {
  const { pathname } = useLocation();

  return (
    <header className="bg-card border-b">
      <div className="container h-16 mx-auto px-4 flex items-center">
        <nav className="mx-6 flex items-center space-x-6">
          {links.map((link) => {
            return (
              <Link
                key={link.href.replace("/", "-")}
                to={link.href}
                className={cn(
                  "text-gray-500 text-sm font-medium transition-colors hover:text-primary",
                  pathname.includes(link.href) && "font-bold text-primary"
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={undefined} alt={undefined} />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {`@${profile.username}`}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    className="group w-full flex justify-between text-gray-600 cursor-pointer"
                    to="/profile"
                  >
                    Perfil
                    <UserRoundIcon className="text-gray-400 w-4 h-4 group-hover:text-gray-700" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button
                  className="group w-full justify-between text-gray-600 cursor-pointer"
                  onClick={() => logOut()}
                >
                  Sair
                  <LogOutIcon className="text-gray-400 w-4 h-4 group-hover:text-gray-700" />
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
