
-- Add new role values to existing enum (admin already exists)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'procurement_officer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'it_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'compliance';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'executive';
