import LeadsTable from "@/components/LeadsTable";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("assigned_to", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Мои лиды</h1>
        <p className="mt-1 text-sm text-gray-500">
          Лиды, назначенные вам
        </p>
      </div>
      <LeadsTable leads={(leads as Lead[]) ?? []} />
    </div>
  );
}
