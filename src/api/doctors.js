import { supabase } from '../supabase/client'

// Returns { data, error } so pages can show the real error instead of an empty list
export const fetchDoctors = async () => {
  try {
    const { data, error } = await supabase.from('doctors').select('*')
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

export const getDoctorById = async (id) => {
  const { data, error } = await supabase.from('doctors').select('*').eq('id', id).single()
  if (error) { console.error(error); return null }
  return data
}

export const deleteDoctor = async (id) => {
  const { error: doctorError } = await supabase.from('doctors').delete().eq('id', id)
  if (doctorError) return { success: false, error: doctorError.message }

  const { error: userError } = await supabase
    .from('users')
    .update({ is_active: false })
    .eq('id', id)

  if (userError) return { success: false, error: userError.message }
  return { success: true }
}