import Header from "@/components/Header";
import { getCurrentProfile, requireAuth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Профиль не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header profile={profile} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
