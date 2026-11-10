import { supabase } from '../supabase/client'

export const createAppointment = async (a) => {
  try {
    const { data, error } = await supabase.from('appointments').insert({
      patient_id: a.patientId,
      patient_name: a.patientName,
      patient_email: a.patientEmail,
      patient_phone: a.patientPhone,
      doctor_id: a.doctorId,
      doctor_name: a.doctorName,
      date: a.date,
      time: a.time,
      symptoms: a.symptoms,
      notes: a.notes || '',
      fee: a.fee,
      status: 'pending'
    }).select().single()

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'This time slot was just booked by someone else. Please choose another slot.' }
      }
      if (error.code === '42501') {
        return { success: false, error: 'This doctor is not accepting bookings right now.' }
      }
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const getBookedSlots = async (doctorId, date) => {
  const { data, error } = await supabase.rpc('get_booked_slots', { p_doctor: doctorId, p_date: date })
  if (error) return []
  return (data || []).map(r => r.slot_time)
}

const listBy = async (column, value) => {
  try {
    const { data, error } = await supabase
      .from('appointments').select('*').eq(column, value).order('created_at', { ascending: false })
    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const getAppointmentsByUser = (userId) => listBy('patient_id', userId)
export const getAppointmentsByDoctor = (doctorId) => listBy('doctor_id', doctorId)

export const getAllAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments').select('*').order('created_at', { ascending: false })
    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const updateAppointmentStatus = async (id, status) => {
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export const deleteAppointment = async (id) => {
  const { error } = await supabase.from('appointments').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}