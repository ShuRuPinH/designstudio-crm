import { signOut } from "@/app/actions/auth";
import type { Profile } from "@/lib/types";
import Link from "next/link";

interface HeaderProps {
  profile: Profile;
}

export default function Header({ profile }: HeaderProps) {
  const isAdmin = profile.role === "admin";

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900">
            Designstudio
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Мои лиды
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin/leads"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Все лиды
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Пользователи
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {profile.full_name ?? "Пользователь"}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Выйти
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
