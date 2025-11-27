-- =====================================================
-- NOMI DATABASE SCHEMA - Production Ready
-- =====================================================

-- Tipos ENUM para estados y roles
CREATE TYPE user_role AS ENUM ('admin', 'hr', 'employee');
CREATE TYPE company_status AS ENUM ('active', 'suspended', 'pending');
CREATE TYPE employee_status AS ENUM ('active', 'suspended', 'pending');
CREATE TYPE transaction_status AS ENUM ('pending', 'approved', 'completed', 'rejected');
CREATE TYPE payment_frequency AS ENUM ('weekly', 'biweekly', 'monthly');

-- =====================================================
-- TABLA: companies (Empresas)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rnc TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  credit_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
  credit_used DECIMAL(12,2) NOT NULL DEFAULT 0,
  withdrawal_limit_per_employee DECIMAL(12,2) NOT NULL DEFAULT 0,
  availability_percentage INTEGER NOT NULL DEFAULT 50 CHECK (availability_percentage >= 0 AND availability_percentage <= 100),
  payment_frequency payment_frequency NOT NULL DEFAULT 'biweekly',
  allow_weekend_withdrawals BOOLEAN NOT NULL DEFAULT true,
  payroll_cutoff_days INTEGER NOT NULL DEFAULT 3,
  status company_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLA: profiles (Perfiles de Usuario)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLA: employees (Colaboradores)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_code TEXT NOT NULL,
  cedula TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  available_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_withdrawn DECIMAL(12,2) NOT NULL DEFAULT 0,
  bank_name TEXT,
  bank_account TEXT,
  status employee_status NOT NULL DEFAULT 'pending',
  hire_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, employee_code),
  UNIQUE(company_id, cedula)
);

-- =====================================================
-- TABLA: transactions (Transacciones/Retiros)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  commission DECIMAL(12,2) NOT NULL DEFAULT 95,
  net_amount DECIMAL(12,2) NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  bank_name TEXT,
  bank_account TEXT,
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLA: invitations (Invitaciones de Amigos)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  invitee_name TEXT NOT NULL,
  invitee_email TEXT NOT NULL,
  invitee_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_amount DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLA: support_tickets (Tickets de Soporte)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLA: system_settings (Configuración Global)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar configuraciones por defecto
INSERT INTO public.system_settings (key, value, description) VALUES
  ('default_commission', '95', 'Comisión por defecto por retiro en RD$'),
  ('min_withdrawal', '500', 'Monto mínimo de retiro en RD$'),
  ('max_withdrawal_percentage', '80', 'Porcentaje máximo de retiro del salario disponible'),
  ('support_email', 'soporte@nomi.do', 'Email de soporte'),
  ('support_phone', '809-555-0123', 'Teléfono de soporte')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- ÍNDICES para mejor rendimiento
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_employees_company ON public.employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_user ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
CREATE INDEX IF NOT EXISTS idx_transactions_employee ON public.transactions(employee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_company ON public.transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_company ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =====================================================
-- FUNCIONES de actualización
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_employees_updated_at ON public.employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
