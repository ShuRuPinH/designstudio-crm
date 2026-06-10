import type { Lead } from "@/lib/types";
import { LEAD_STATUS_LABELS } from "@/lib/types";

interface LeadsTableProps {
  leads: Lead[];
  showManager?: boolean;
}

const STATUS_COLORS: Record<Lead["status"], string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-gray-100 text-gray-600",
};

export default function LeadsTable({ leads, showManager = false }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">Лиды не найдены</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-700">Имя</th>
            <th className="px-4 py-3 font-medium text-gray-700">Компания</th>
            <th className="px-4 py-3 font-medium text-gray-700">Email</th>
            <th className="px-4 py-3 font-medium text-gray-700">Телефон</th>
            <th className="px-4 py-3 font-medium text-gray-700">Статус</th>
            {showManager && (
              <th className="px-4 py-3 font-medium text-gray-700">Менеджер</th>
            )}
            <th className="px-4 py-3 font-medium text-gray-700">Дата</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
              <td className="px-4 py-3 text-gray-600">{lead.company ?? "—"}</td>
              <td className="px-4 py-3 text-gray-600">{lead.email ?? "—"}</td>
              <td className="px-4 py-3 text-gray-600">{lead.phone ?? "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status]}`}
                >
                  {LEAD_STATUS_LABELS[lead.status]}
                </span>
              </td>
              {showManager && (
                <td className="px-4 py-3 text-gray-600">
                  {lead.profiles?.full_name ?? "—"}
                </td>
              )}
              <td className="px-4 py-3 text-gray-500">
                {new Date(lead.created_at).toLocaleDateString("ru-RU")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
