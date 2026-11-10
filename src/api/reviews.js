import { supabase } from '../supabase/client'

export const addReview = async (r) => {
  const { data, error } = await supabase.from('reviews').insert({
    doctor_id: r.doctorId,
    patient_id: r.patientId,
    patient_name: r.patientName,
    rating: r.rating,
    comment: r.comment,
    tags: r.tags || [],
    is_approved: true
  }).select().single()

  if (error) {
    if (error.code === '42501') {
      return { success: false, error: 'You can review a doctor only after your appointment with them is confirmed.' }
    }
    if (error.code === '23505') {
      return { success: false, error: 'You have already reviewed this doctor.' }
    }
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export const getReviewsByDoctor = async (doctorId) => {
  const { data, error } = await supabase
    .from('reviews').select('*').eq('doctor_id', doctorId).eq('is_approved', true)
    .order('created_at', { ascending: false })
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export const getAllReviews = async () => {
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export const deleteReview = async (id) => {
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export const checkExistingReview = async (doctorId, patientId) => {
  const { data } = await supabase
    .from('reviews').select('id').eq('doctor_id', doctorId).eq('patient_id', patientId).maybeSingle()
  return !!data
}