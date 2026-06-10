export type UserRole = "manager" | "admin";

export type LeadStatus = "new" | "contacted" | "won" | "lost";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface ProfileWithEmail extends Profile {
  email: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  profiles?: Pick<Profile, "full_name">;
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новый",
  contacted: "Контакт установлен",
  won: "Выигран",
  lost: "Проигран",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  manager: "Менеджер",
  admin: "Администратор",
};
