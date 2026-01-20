"use client";

import React from "react";
import Link from "next/link";
import { Frame, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Frame className="h-6 w-6" />
            <span className="font-bold">White Canvas</span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center space-x-4 md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="p-4">
                <SheetClose asChild>
                   <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                      <Frame className="h-6 w-6" />
                      <span className="font-bold">White Canvas</span>
                    </Link>
                </SheetClose>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                     <SheetClose asChild key={link.name}>
                        <Link
                          href={link.href}
                          className="text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                          {link.name}
                        </Link>
                     </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
