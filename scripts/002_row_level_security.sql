-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Production Ready
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FUNCIÓN HELPER: Obtener rol del usuario actual
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- FUNCIÓN HELPER: Obtener company_id del usuario actual
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- POLÍTICAS: companies
-- =====================================================
-- Admins pueden ver todas las empresas
CREATE POLICY "admins_select_all_companies" ON public.companies
  FOR SELECT USING (public.get_user_role() = 'admin');

-- Admins pueden insertar empresas
CREATE POLICY "admins_insert_companies" ON public.companies
  FOR INSERT WITH CHECK (public.get_user_role() = 'admin');

-- Admins pueden actualizar empresas
CREATE POLICY "admins_update_companies" ON public.companies
  FOR UPDATE USING (public.get_user_role() = 'admin');

-- HR y employees pueden ver solo su empresa
CREATE POLICY "users_select_own_company" ON public.companies
  FOR SELECT USING (id = public.get_user_company_id());

-- =====================================================
-- POLÍTICAS: profiles
-- =====================================================
-- Usuarios pueden ver su propio perfil
CREATE POLICY "users_select_own_profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Usuarios pueden insertar su propio perfil
CREATE POLICY "users_insert_own_profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Admins pueden ver todos los perfiles
CREATE POLICY "admins_select_all_profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role() = 'admin');

-- HR puede ver perfiles de su empresa
CREATE POLICY "hr_select_company_profiles" ON public.profiles
  FOR SELECT USING (
    public.get_user_role() = 'hr' AND 
    company_id = public.get_user_company_id()
  );

-- =====================================================
-- POLÍTICAS: employees
-- =====================================================
-- Admins pueden ver todos los empleados
CREATE POLICY "admins_select_all_employees" ON public.employees
  FOR SELECT USING (public.get_user_role() = 'admin');

-- Admins pueden gestionar empleados
CREATE POLICY "admins_insert_employees" ON public.employees
  FOR INSERT WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "admins_update_employees" ON public.employees
  FOR UPDATE USING (public.get_user_role() = 'admin');

-- HR puede ver empleados de su empresa
CREATE POLICY "hr_select_company_employees" ON public.employees
  FOR SELECT USING (
    public.get_user_role() = 'hr' AND 
    company_id = public.get_user_company_id()
  );

-- HR puede insertar empleados en su empresa
CREATE POLICY "hr_insert_company_employees" ON public.employees
  FOR INSERT WITH CHECK (
    public.get_user_role() = 'hr' AND 
    company_id = public.get_user_company_id()
  );

-- HR puede actualizar empleados de su empresa
CREATE POLICY "hr_update_company_employees" ON public.employees
  FOR UPDATE USING (
    public.get_user_role() = 'hr' AND 
    company_id = public.get_user_company_id()
  );

-- Empleados pueden ver solo su propio registro
CREATE POLICY "employees_select_own" ON public.employees
  FOR SELECT USING (user_id = auth.uid());

-- Empleados pueden actualizar ciertos campos propios
CREATE POLICY "employees_update_own" ON public.employees
  FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- POLÍTICAS: transactions
-- =====================================================
-- Admins pueden ver todas las transacciones
CREATE POLICY "admins_select_all_transactions" ON public.transactions
  FOR SELECT USING (public.get_user_role() = 'admin');

-- Admins pueden gestionar transacciones
CREATE POLICY "admins_update_transactions" ON public.transactions
  FOR UPDATE USING (public.get_user_role() = 'admin');

-- HR puede ver transacciones de su empresa
CREATE POLICY "hr_select_company_transactions" ON public.transactions
  FOR SELECT USING (
    public.get_user_role() = 'hr' AND 
    company_id = public.get_user_company_id()
  );

-- Empleados pueden ver sus transacciones
CREATE POLICY "employees_select_own_transactions" ON public.transactions
  FOR SELECT USING (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

-- Empleados pueden crear transacciones (retiros)
CREATE POLICY "employees_insert_transactions" ON public.transactions
  FOR INSERT WITH CHECK (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

-- =====================================================
-- POLÍTICAS: invitations
-- =====================================================
-- Empleados pueden ver sus invitaciones
CREATE POLICY "employees_select_own_invitations" ON public.invitations
  FOR SELECT USING (
    inviter_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

-- Empleados pueden crear invitaciones
CREATE POLICY "employees_insert_invitations" ON public.invitations
  FOR INSERT WITH CHECK (
    inviter_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

-- Admins pueden ver todas las invitaciones
CREATE POLICY "admins_select_all_invitations" ON public.invitations
  FOR SELECT USING (public.get_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: support_tickets
-- =====================================================
-- Empleados pueden ver sus tickets
CREATE POLICY "employees_select_own_tickets" ON public.support_tickets
  FOR SELECT USING (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

-- Empleados pueden crear tickets
CREATE POLICY "employees_insert_tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

-- Admins pueden gestionar todos los tickets
CREATE POLICY "admins_select_all_tickets" ON public.support_tickets
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "admins_update_tickets" ON public.support_tickets
  FOR UPDATE USING (public.get_user_role() = 'admin');

-- =====================================================
-- POLÍTICAS: system_settings
-- =====================================================
-- Solo admins pueden ver y modificar configuración
CREATE POLICY "admins_select_settings" ON public.system_settings
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "admins_update_settings" ON public.system_settings
  FOR UPDATE USING (public.get_user_role() = 'admin');
