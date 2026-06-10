"use client";

import { ROLE_LABELS, type Profile } from "@/lib/types";
import { useFormState, useFormStatus } from "react-dom";
import { createUser, deleteUserAction, updateUserRoleAction } from "./actions";

function CreateUserSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "Создание..." : "Создать пользователя"}
    </button>
  );
}

function CreateUserForm() {
  const [state, formAction] = useFormState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return createUser(formData);
    },
    null
  );

  return (
    <form action={formAction} className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Новый пользователь
      </h2>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Пользователь создан
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-gray-700">
            Имя
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
            Роль
          </label>
          <select
            id="role"
            name="role"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="manager">Менеджер</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <CreateUserSubmitButton />
      </div>
    </form>
  );
}

function UserRow({ user, currentUserId }: { user: Profile; currentUserId: string }) {
  const isSelf = user.id === currentUserId;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 font-medium text-gray-900">{user.full_name}</td>
      <td className="px-4 py-3 text-gray-600">{user.email}</td>
      <td className="px-4 py-3">
        {isSelf ? (
          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {ROLE_LABELS[user.role]}
          </span>
        ) : (
          <form action={updateUserRoleAction}>
            <input type="hidden" name="user_id" value={user.id} />
            <select
              name="role"
              defaultValue={user.role}
              onChange={(e) => e.target.form?.requestSubmit()}
              className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="manager">Менеджер</option>
              <option value="admin">Администратор</option>
            </select>
          </form>
        )}
      </td>
      <td className="px-4 py-3 text-gray-500">
        {new Date(user.created_at).toLocaleDateString("ru-RU")}
      </td>
      <td className="px-4 py-3">
        {!isSelf && (
          <form
            action={deleteUserAction}
            onSubmit={(e) => {
              if (!confirm(`Удалить пользователя ${user.full_name}?`)) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="user_id" value={user.id} />
            <button
              type="submit"
              className="text-sm text-red-600 hover:text-red-800"
            >
              Удалить
            </button>
          </form>
        )}
      </td>
    </tr>
  );
}

interface UsersManagementProps {
  users: Profile[];
  currentUserId: string;
}

export default function UsersManagement({ users, currentUserId }: UsersManagementProps) {
  return (
    <div className="space-y-6">
      <CreateUserForm />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Имя</th>
              <th className="px-4 py-3 font-medium text-gray-700">Email</th>
              <th className="px-4 py-3 font-medium text-gray-700">Роль</th>
              <th className="px-4 py-3 font-medium text-gray-700">Дата</th>
              <th className="px-4 py-3 font-medium text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <UserRow key={user.id} user={user} currentUserId={currentUserId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
