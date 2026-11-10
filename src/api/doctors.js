import { supabase } from '../supabase/client'

// Public listing: approved doctors only
export const fetchDoctors = async () => {
  try {
    const { data, error } = await supabase
      .from('doctors').select('*').eq('verification_status', 'approved')
    if (error) {
      console.error('Doctors fetch error:', error)
      return { data: [], error: error.message || 'Could not load doctors' }
    }
    return { data: data || [], error: null }
  } catch (err) {
    console.error('Doctors fetch crashed:', err)
    return { data: [], error: err.message || 'Could not load doctors' }
  }
}

export const getAllDoctors = async () => {
  const { data } = await fetchDoctors()
  return data
}

// Visible to the public only if approved; the doctor and admins can also open their own/any profile
export const getDoctorById = async (id) => {
  const { data, error } = await supabase.from('doctors').select('*').eq('id', id).single()
  if (error) { console.error(error); return null }
  return data
}

// ---- Admin ----
export const fetchAllDoctorsAdmin = async () => {
  const { data, error } = await supabase.from('doctors').select('*').order('name')
  if (error) return { data: [], error: error.message }
  return { data: data || [], error: null }
}

export const setDoctorStatus = async (id, status, adminId, reason = '') => {
  const patch = {
    verification_status: status,
    rejection_reason: status === 'rejected' || status === 'suspended' ? (reason || null) : null,
    verified_at: status === 'approved' ? new Date().toISOString() : null,
    verified_by: adminId
  }
  const { data, error } = await supabase.from('doctors').update(patch).eq('id', id).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export const deleteDoctor = async (id) => {
  const { error } = await supabase.from('doctors').delete().eq('id', id)
  if (error) {
    if (error.code === '23503') {
      return { success: false, error: 'This doctor has appointments or chats, so they cannot be deleted. Use Suspend instead.' }
    }
    return { success: false, error: error.message }
  }
  await supabase.from('users').update({ is_active: false }).eq('id', id)
  return { success: true }
}

// ---- Doctor ----
export const resubmitForReview = async (id) => {
  const { data, error } = await supabase
    .from('doctors').update({ verification_status: 'pending' }).eq('id', id).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}