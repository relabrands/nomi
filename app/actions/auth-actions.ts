"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function createCompanyAdmin(email: string, companyId: string) {
    // Generate a random password
    const password = Math.random().toString(36).slice(-10) + "A1!"

    // 1. Create Auth User
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            role: "hr",
            company_id: companyId,
        },
    })

    if (createError) {
        console.error("Error creating company admin:", createError)
        return { error: createError.message }
    }

    if (!user.user) {
        return { error: "Failed to create user" }
    }

    // 2. Update Profile Role and Company ID
    // The trigger creates the profile, but we need to ensure it has the correct role and company_id
    // We wait a brief moment for the trigger or just update it directly
    const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
            role: "hr",
            company_id: companyId,
        })
        .eq("id", user.user.id)

    if (updateError) {
        console.error("Error updating profile:", updateError)
        // Continue anyway as the user is created
    }

    return { success: true, password, userId: user.user.id }
}

export async function createEmployeeUser(
    employeeData: {
        email: string
        full_name: string
        cedula: string
        employee_code: string
        salary: number
        company_id: string
        available_balance: number
    },
) {
    // Generate a random password
    const password = Math.random().toString(36).slice(-10) + "A1!"

    // 1. Create Auth User
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: employeeData.email,
        password,
        email_confirm: true,
        user_metadata: {
            role: "employee",
            full_name: employeeData.full_name,
            company_id: employeeData.company_id,
        },
    })

    if (createError) {
        console.error("Error creating employee user:", createError)
        return { error: createError.message }
    }

    if (!user.user) {
        return { error: "Failed to create user" }
    }

    // 2. Insert into Employees Table
    // We use the admin client to bypass RLS if needed, or just to ensure consistency
    const { data: employee, error: insertError } = await supabaseAdmin
        .from("employees")
        .insert({
            user_id: user.user.id,
            profile_id: user.user.id, // Assuming profile ID matches user ID (standard Supabase pattern)
            company_id: employeeData.company_id,
            employee_code: employeeData.employee_code,
            cedula: employeeData.cedula,
            full_name: employeeData.full_name,
            email: employeeData.email,
            salary: employeeData.salary,
            available_balance: employeeData.available_balance,
            status: "active",
        })
        .select()
        .single()

    if (insertError) {
        console.error("Error inserting employee record:", insertError)
        // Try to clean up the auth user if employee creation fails
        await supabaseAdmin.auth.admin.deleteUser(user.user.id)
        return { error: "Error al crear ficha de empleado: " + insertError.message }
    }

    // 3. Update Profile Company ID (Trigger might have created it, but let's be sure)
    await supabaseAdmin
        .from("profiles")
        .update({
            company_id: employeeData.company_id,
            role: "employee",
            full_name: employeeData.full_name,
        })
        .eq("id", user.user.id)

    return { success: true, password, employee }
}
