-- Типы
CREATE TYPE user_role AS ENUM ('manager', 'admin');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');

-- Профили пользователей
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'manager',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Лиды
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Автообновление updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Функция проверки роли admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Profiles: пользователь видит свой профиль, admin — все
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (is_admin() AND id != auth.uid());

-- Leads: менеджер видит только свои, admin — все
CREATE POLICY "Managers can view own leads"
  ON leads FOR SELECT
  USING (assigned_to = auth.uid());

CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert leads"
  ON leads FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update leads"
  ON leads FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete leads"
  ON leads FOR DELETE
  USING (is_admin());

CREATE POLICY "Managers can update own leads"
  ON leads FOR UPDATE
  USING (assigned_to = auth.uid());

-- Тестовые данные (опционально)
-- INSERT INTO auth.users ... — создайте пользователей через Supabase Studio или admin/users
