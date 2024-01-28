"use client";
import useStore from "@/lib/store/UserStore";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";

function Header() {
  const { isLogged, email, givenName, logOut, picture } = useStore();

  const pathname = usePathname();
  console.log(pathname, "this is pathname");

  return (
    <header className="flex w-full justify-between border-b-2 pb-2">
      <Link
        href={"/"}
        className="font-bold dark:text-primary tracking-wider text-[18px]"
      >
        MyCodeJudge
      </Link>

      <div className="flex text-gray-200 gap-4 items-center">
        {!isLogged && (
          <Link
            href={`/auth?callback=${pathname}`}
            className="py-1 px-4 bg-gray-700 cursor-pointer rounded-3xl"
          >
            Login
          </Link>
        )}

        {isLogged && (
          <>
            <span className="text-[14px] text-gray-500">{givenName}</span>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={picture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-[14px] text-gray-500">
                      {givenName}
                    </span>
                    <span className="text-[12px] text-gray-500">{email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
