-- =====================================================
-- DATOS DE DEMOSTRACIÓN (OPCIONAL)
-- Ejecutar solo para testing
-- =====================================================

-- Insertar empresa demo
INSERT INTO public.companies (
  id, name, rnc, email, phone, address,
  credit_limit, credit_used, withdrawal_limit_per_employee,
  availability_percentage, payment_frequency, status
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Grupo ABC Dominicana',
  '130-12345-6',
  'rrhh@grupoabc.com.do',
  '809-555-0100',
  'Av. Winston Churchill #45, Santo Domingo',
  5000000.00,
  1250000.00,
  25000.00,
  50,
  'biweekly',
  'active'
) ON CONFLICT DO NOTHING;

-- Insertar segunda empresa demo
INSERT INTO public.companies (
  id, name, rnc, email, phone, address,
  credit_limit, credit_used, withdrawal_limit_per_employee,
  availability_percentage, payment_frequency, status
) VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'Comercial XYZ',
  '131-67890-1',
  'recursos@comercialxyz.com.do',
  '809-555-0200',
  'Calle El Conde #123, Zona Colonial',
  2000000.00,
  450000.00,
  15000.00,
  60,
  'monthly',
  'active'
) ON CONFLICT DO NOTHING;
