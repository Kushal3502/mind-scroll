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
import { Moon, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function Navbar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl bg-background/10 flex justify-between items-center md:px-12 px-6 py-4">
      <Link href={"/"} className="flex items-center space-x-3">
        <h1 className="md:text-3xl text-xl font-semibold">MindScroll</h1>
      </Link>
      <div className="flex items-center gap-4">
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
              <DropdownMenuContent className=" mr-6">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Add transictions</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
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
