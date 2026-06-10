import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import UsersManagement from "./UsersManagement";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  const supabase = createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
        <p className="mt-1 text-sm text-gray-500">
          Управление пользователями системы
        </p>
      </div>
      <UsersManagement
        users={(users as Profile[]) ?? []}
        currentUserId={user!.id}
      />
    </div>
  );
}
