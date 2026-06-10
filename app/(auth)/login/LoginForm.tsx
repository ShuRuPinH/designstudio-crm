"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, signUp } from "./actions";

type AuthMode = "login" | "register";

type AuthState = {
  error?: string;
  success?: string;
};

function SubmitButton({ mode }: { mode: AuthMode }) {
  const { pending } = useFormStatus();

  const label =
    mode === "login"
      ? pending
        ? "Вход..."
        : "Войти"
      : pending
        ? "Регистрация..."
        : "Зарегистрироваться";

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function AuthFormFields({ mode }: { mode: AuthMode }) {
  return (
    <>
      {mode === "register" && (
        <div>
          <label
            htmlFor="full_name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Имя
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Иван Иванов"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="manager@designstudio.ru"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {mode === "register" && (
        <div>
          <label
            htmlFor="confirm_password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Подтверждение пароля
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}
    </>
  );
}

function AuthForm({ mode }: { mode: AuthMode }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction] = useActionState(action, null as AuthState | null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.success}
        </div>
      )}

      <AuthFormFields mode={mode} />
      <SubmitButton mode={mode} />
    </form>
  );
}

export default function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div>
      <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "login"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "register"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Регистрация
        </button>
      </div>

      <AuthForm key={mode} mode={mode} />
    </div>
  );
}
