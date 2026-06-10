"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";
import { revalidatePath } from "next/cache";

async function syncUserRole(userId: string, role: UserRole) {
  const adminClient = createAdminClient();

  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (profileError) {
    return { error: profileError.message };
  }

  const { error: authError } = await adminClient.auth.admin.updateUserById(
    userId,
    { app_metadata: { role } }
  );

  if (authError) {
    return { error: authError.message };
  }

  return { success: true };
}

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as UserRole;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Не авторизован" };
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") {
    return { error: "Недостаточно прав" };
  }

  const adminClient = createAdminClient();

  const { data: newUser, error: authError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
      app_metadata: { role },
    });

  if (authError || !newUser.user) {
    return { error: authError?.message ?? "Ошибка создания пользователя" };
  }

  if (role !== "manager") {
    const result = await syncUserRole(newUser.user.id, role);
    if (result.error) {
      await adminClient.auth.admin.deleteUser(newUser.user.id);
      return { error: result.error };
    }
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Не авторизован" };
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") {
    return { error: "Недостаточно прав" };
  }

  if (userId === user.id) {
    return { error: "Нельзя изменить свою роль" };
  }

  const result = await syncUserRole(userId, role);
  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Не авторизован" };
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") {
    return { error: "Недостаточно прав" };
  }

  if (userId === user.id) {
    return { error: "Нельзя удалить себя" };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRoleAction(formData: FormData) {
  const userId = formData.get("user_id") as string;
  const role = formData.get("role") as UserRole;
  await updateUserRole(userId, role);
}

export async function deleteUserAction(formData: FormData) {
  const userId = formData.get("user_id") as string;
  await deleteUser(userId);
}
