import LeadsTable from "@/components/LeadsTable";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Все лиды</h1>
        <p className="mt-1 text-sm text-gray-500">
          Полный список лидов отдела продаж
        </p>
      </div>
      <LeadsTable leads={(leads as Lead[]) ?? []} showManager />
    </div>
  );
}
