"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type AuthState = {
  error?: string;
  success?: string;
};

export async function signIn(
  _prev: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Неверный email или пароль" };
  }

  redirect("/dashboard");
}

export async function signUp(
  _prev: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const fullName = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!fullName) {
    return { error: "Укажите имя" };
  }

  if (password.length < 6) {
    return { error: "Пароль должен быть не менее 6 символов" };
  }

  if (password !== confirmPassword) {
    return { error: "Пароли не совпадают" };
  }

  const adminClient = createAdminClient();

  const { data: newUser, error: authError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
      app_metadata: { role: "manager" },
    });

  if (authError || !newUser.user) {
    const message = authError?.message ?? "Не удалось создать аккаунт";
    if (message.toLowerCase().includes("already")) {
      return { error: "Пользователь с таким email уже зарегистрирован" };
    }
    return { error: message };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      success: "Аккаунт создан. Войдите с вашим email и паролем.",
    };
  }

  redirect("/dashboard");
}
