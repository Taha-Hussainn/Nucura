import { supabase } from '../supabase/client'

const empty = (v) => (v === '' || v === undefined ? null : v)

export const updateUserProfile = async (id, fields) => {
  const payload = {
    name: fields.name,
    phone: fields.phone,
    address: fields.address,
    date_of_birth: empty(fields.date_of_birth),
    gender: empty(fields.gender),
    blood_group: empty(fields.blood_group),
    allergies: empty(fields.allergies),
    chronic_conditions: empty(fields.chronic_conditions),
    emergency_contact_name: empty(fields.emergency_contact_name),
    emergency_contact_phone: empty(fields.emergency_contact_phone)
  }
  const { data, error } = await supabase.from('users').update(payload).eq('id', id).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}