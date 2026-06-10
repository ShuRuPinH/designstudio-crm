-- Таблица профилей пользователей
CREATE TABLE public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  text,
  role       text NOT NULL DEFAULT 'manager'
             CHECK (role IN ('manager', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Автоматически создаём профиль при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Таблица лидов
CREATE TABLE public.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  company     text,
  phone       text,
  email       text,
  status      text DEFAULT 'new'
              CHECK (status IN ('new','contacted','won','lost')),
  assigned_to uuid REFERENCES public.profiles(id),
  notes       text,
  created_at  timestamptz DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads    ENABLE ROW LEVEL SECURITY;

-- ПОЛИТИКИ ДЛЯ PROFILES

-- Каждый видит только свой профиль
CREATE POLICY "profiles: own read"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Админ видит все профили
CREATE POLICY "profiles: admin read all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin');

-- ПОЛИТИКИ ДЛЯ LEADS

-- Менеджер видит только своих лидов
CREATE POLICY "leads: manager sees own"
  ON public.leads FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

-- Менеджер может создавать лидов (автоматически назначает себя)
CREATE POLICY "leads: manager insert"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (assigned_to = auth.uid());

-- Менеджер может редактировать своих лидов
CREATE POLICY "leads: manager update own"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());

-- Админ видит всех лидов
CREATE POLICY "leads: admin read all"
  ON public.leads FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'app_metadata')::jsonb->>'role' = 'admin');
