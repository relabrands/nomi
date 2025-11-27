export type UserRole = "admin" | "hr" | "employee"
export type CompanyStatus = "active" | "suspended" | "pending"
export type EmployeeStatus = "active" | "suspended" | "pending"
export type TransactionStatus = "pending" | "approved" | "completed" | "rejected"
export type PaymentFrequency = "weekly" | "biweekly" | "monthly"

export interface Company {
  id: string
  name: string
  rnc: string
  email: string
  phone?: string
  address?: string
  logo_url?: string
  credit_limit: number
  credit_used: number
  withdrawal_limit_per_employee: number
  availability_percentage: number
  payment_frequency: PaymentFrequency
  allow_weekend_withdrawals: boolean
  payroll_cutoff_days: number
  status: CompanyStatus
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  company_id?: string
  avatar_url?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  user_id?: string
  profile_id?: string
  company_id: string
  employee_code: string
  cedula: string
  full_name: string
  email: string
  salary: number
  available_balance: number
  total_withdrawn: number
  bank_name?: string
  bank_account?: string
  status: EmployeeStatus
  hire_date?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  employee_id: string
  company_id: string
  amount: number
  commission: number
  net_amount: number
  status: TransactionStatus
  bank_name?: string
  bank_account?: string
  processed_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface SupportTicket {
  id: string
  employee_id: string
  subject: string
  message: string
  status: string
  priority: string
  response?: string
  responded_at?: string
  created_at: string
}

export interface Invitation {
  id: string
  inviter_id: string
  invitee_name: string
  invitee_email: string
  invitee_phone?: string
  status: string
  reward_amount: number
  created_at: string
}
