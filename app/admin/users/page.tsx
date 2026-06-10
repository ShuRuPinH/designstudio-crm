import { getCurrentUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProfileWithEmail } from "@/lib/types";
import UsersManagement from "./UsersManagement";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  const adminClient = createAdminClient();

  const [{ data: profiles }, { data: authData }] = await Promise.all([
    adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    adminClient.auth.admin.listUsers(),
  ]);

  const emailById = new Map(
    authData?.users.map((authUser) => [authUser.id, authUser.email ?? ""]) ?? []
  );

  const users: ProfileWithEmail[] = (profiles ?? []).map((profile) => ({
    ...profile,
    email: emailById.get(profile.id) ?? "",
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Пользователи</h1>
        <p className="mt-1 text-sm text-gray-500">
          Управление пользователями системы
        </p>
      </div>
      <UsersManagement
        users={users}
        currentUserId={user!.id}
      />
    </div>
  );
}
