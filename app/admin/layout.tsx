import Header from "@/components/Header";
import { getCurrentProfile, requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Профиль не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header profile={currentProfile} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
