"use client";

import { handleSignOut } from "@/app/actions/authActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  House,
  LayoutDashboard,
  LogOut,
  Moon,
  Pencil,
  Sun,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navbarItems = [
  {
    name: "Home",
    icon: <House />,
    path: "/home",
  },
  {
    name: "Add blog",
    icon: <Pencil />,
    path: "/blogs/add",
  },
  // {
  //   name: "Favourites",
  //   icon: <Heart />,
  //   path: "/blogs/favourites",
  // },
  {
    name: "Dashboard",
    icon: <LayoutDashboard />,
    path: "/dashboard",
  },
];

function Navbar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl bg-background/60 flex justify-between items-center md:px-14 px-6 py-4">
      <Link href={"/"} className="flex items-center space-x-3">
        <h1 className="md:text-3xl text-xl font-semibold">MindScroll</h1>
      </Link>
      <div className="flex items-center gap-4">
        <div className="md:flex items-center gap-2 hidden">
          {navbarItems.map((item) => (
            <Link href={item.path} key={item.name}>
              <Button
                variant="ghost"
                className="text-base hover:bg-accent flex items-center gap-2"
                aria-label={item.name}
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 ease-in-out dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
        <div className=" flex items-center gap-4">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                {session?.user?.image ? (
                  <Image
                    src={session?.user?.image as string}
                    alt="user"
                    height={100}
                    width={100}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="m-4 w-52">
                <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navbarItems.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    className="cursor-pointer p-0"
                  >
                    <Link
                      href={item.path}
                      className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-sm"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={"/signin"}>
              <Button>Signin</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
