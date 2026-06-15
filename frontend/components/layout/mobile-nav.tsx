"use client";

import Link from "next/link";

export function MobileNav() {
  return (
    <div
      className="
      md:hidden
      fixed
      bottom-0
      left-0
      right-0
      border-t
      bg-background
      h-16
      flex
      items-center
      justify-around
    "
    >
      <Link href="/">
        Home
      </Link>

      <Link href="/assignments">
        Assignments
      </Link>

      <Link href="/library">
        Library
      </Link>
    </div>
  );
}