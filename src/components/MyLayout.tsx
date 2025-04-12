"use client";
import {
  Brain,
  BrainCircuit,
  CalendarFold,
  Home,
  PackageOpen,
  PanelLeft,
  User2,
  UserCircle2,
  Users2,
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "~/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "~/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { User } from "@prisma/client";
import { ModeToggle } from "./ModeToggle";
import { usePathname } from "next/navigation";
import { useUser } from "./AuthComponent";
import { signOut } from "next-auth/react";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [links, setLinks] = useState([
    { title: "Home", href: "/", icon: <Home /> },
    { title: "Classrooms", href: "/classrooms", icon: <PackageOpen /> },
    { title: "Page", href: "/page", icon: <User2 /> },
    { title: "Hello", href: "/hello", icon: <CalendarFold /> },
  ]);
  const { user } = useUser();

  return (
    <>
      <nav className="hidden bg-white md:block dark:bg-black">
        <div className="z-[30] mx-2 flex flex-wrap items-center justify-between p-2 md:mx-10">
          <a
            href="/"
            className="flex items-center space-x-3 text-black rtl:space-x-reverse dark:text-white"
          >
            <BrainCircuit />
            <div className="py-auto">
              <span
                className="text-[22px] text-black md:text-[24px] dark:text-white"
                style={{ lineHeight: "32px", fontWeight: "600" }}
              >
                QConnect
              </span>
            </div>
          </a>
          <div className="z-[30] hidden text-black md:block dark:text-white">
            <div className="-mx-6 flex flex-col space-x-8 lg:mx-8 lg:flex-row lg:items-center">
              {links.map((link) => (
                <div className="py-2" key={link.title}>
                  <Link
                    href={link.href}
                    className={cn(
                      "group relative flex min-h-0 flex-1 flex-row gap-3 overflow-auto border-b-2 border-transparent px-1 group-data-[collapsible=icon]:overflow-hidden",
                      {
                        "text-green-600": pathname.endsWith(`${link.href}`),
                      }
                    )}
                  >
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-600 transition-all duration-300 group-hover:w-full" />

                    {link.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white md:mx-8 dark:bg-black" id="navbar-default">
              <div className="flex gap-5">
                <ModeToggle />
                {user ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="my-auto block rounded text-black hover:text-black md:border-0 md:p-0 md:hover:bg-transparent dark:text-white dark:hover:text-gray-400">
                          {user.image ? (
                            <Image
                              src={user.image}
                              height={35}
                              width={35}
                              className="border-0.5 rounded-full border-black shadow shadow-black dark:border-white dark:shadow-white"
                              alt={user.name!}
                            />
                          ) : (
                            <UserCircle2 />
                          )}
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Profile</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/profile/${user.id}`}>
                          <DropdownMenuItem>{user.name}</DropdownMenuItem>
                        </Link>
                        <Link href={`/profile/${user.id}`}>
                          <DropdownMenuItem>{user.email}</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => {
                            signOut();
                          }}
                        >
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Link href="/login">
                    <Button className="hidden md:block">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </nav>

      <div className="bg-muted/40 flex min-h-screen w-full flex-col md:hidden">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="bg-background sticky top-0 z-30 flex h-14 w-full items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <Sheet>
              <div className="flex w-full justify-between">
                <div className="flex gap-2">
                  <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                      <PanelLeft className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <a
                    href="/"
                    className="flex items-center space-x-3 text-black rtl:space-x-reverse dark:text-white"
                  >
                    <Brain />
                    <div className="py-auto">
                      <span
                        className="text-[22px] text-black md:text-[24px] dark:text-white"
                        style={{ lineHeight: "32px", fontWeight: "600" }}
                      >
                        QConnect
                      </span>
                    </div>
                  </a>
                </div>
                <ModeToggle />
              </div>
              <SheetContent
                side="left"
                className="bg-white sm:max-w-xs dark:bg-black"
              >
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="#"
                    className="group bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
                    prefetch={false}
                  >
                    <Brain className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">QConnect</span>
                  </Link>
                  {links.map((link) => (
                    <Link
                      href={link.href}
                      key={link.title}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                      prefetch={false}
                    >
                      {link.icon}
                      {link.title}
                    </Link>
                  ))}
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="my-auto block rounded text-black hover:text-black md:border-0 md:p-0 md:hover:bg-transparent dark:text-white dark:hover:text-gray-400">
                          {user.image ? (
                            <div className="text-muted-foreground hover:text-foreground flex items-center gap-4 border-t border-black/60 px-2.5 pt-5 dark:border-white/60">
                              <Image
                                src={user.image}
                                height={35}
                                width={35}
                                className="border-0.5 rounded-full border-black shadow shadow-black dark:border-white dark:shadow-white"
                                alt={user.name!}
                              />
                              {user.name}
                            </div>
                          ) : (
                            <div className="text-muted-foreground hover:text-foreground flex items-center gap-4 border-t border-black/60 px-2.5 pt-5 dark:border-white/60">
                              <UserCircle2 />
                              <p>My Profile</p>
                            </div>
                          )}
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Profile</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/profile/${user.id}`}>
                          <DropdownMenuItem>{user.name}</DropdownMenuItem>
                        </Link>
                        <Link href={`/profile/${user.id}`}>
                          <DropdownMenuItem>{user.email}</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => {
                            signOut();
                          }}
                        >
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/login">
                      <button className="text-muted-foreground hover:text-foreground flex items-center gap-4 border-t border-black/60 px-2.5 pt-5 dark:border-white/60">
                        <User2 className="h-5 w-5" />
                        Login
                      </button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </header>
        </div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </>
  );
};

export default Navbar;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <div>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </div>
    </li>
  );
});
ListItem.displayName = "ListItem";
