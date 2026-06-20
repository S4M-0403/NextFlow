"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function SidebarUserSection() {
  const { user, isLoaded } = useUser();

  const displayName =
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Account";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2">
      {isLoaded ? (
        <>
          <UserButton />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {displayName}
            </p>
            {user?.primaryEmailAddress?.emailAddress ? (
              <p className="truncate text-[11px] text-slate-400">
                {user.primaryEmailAddress.emailAddress}
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-500">
            {initials || "…"}
          </div>
          <span className="text-sm text-slate-400">Loading account...</span>
        </>
      )}
    </div>
  );
}
