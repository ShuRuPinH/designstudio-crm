export type UserRole = "manager" | "admin";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: LeadStatus;
  assigned_to: string;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "full_name" | "email">;
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новый",
  contacted: "Контакт установлен",
  qualified: "Квалифицирован",
  proposal: "Предложение",
  won: "Выигран",
  lost: "Проигран",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  manager: "Менеджер",
  admin: "Администратор",
};
