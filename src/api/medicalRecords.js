import { supabase } from '../supabase/client'

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png']

export const uploadMedicalRecord = async (patientId, patientName, file, category, description) => {
  try {
    if (!ALLOWED.includes(file.type)) return { success: false, error: 'Only PDF, JPG and PNG files are allowed.' }
    if (file.size > MAX_BYTES) return { success: false, error: 'File is larger than 10MB.' }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${patientId}/${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage.from('medical-records').upload(path, file)
    if (uploadError) return { success: false, error: uploadError.message }

    const { data, error } = await supabase.from('medical_records').insert({
      patient_id: patientId,
      patient_name: patientName,
      file_name: file.name,
      file_path: path,
      file_type: file.type,
      file_size: (file.size / 1024).toFixed(1) + ' KB',
      category,
      description
    }).select().single()

    if (error) {
      await supabase.storage.from('medical-records').remove([path])
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const getMedicalRecordsByPatient = async (patientId) => {
  const { data, error } = await supabase
    .from('medical_records').select('*').eq('patient_id', patientId).order('created_at', { ascending: false })
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

// Records are private: files are opened through short-lived signed links
export const getRecordUrl = async (path) => {
  if (!path) return null
  const { data, error } = await supabase.storage.from('medical-records').createSignedUrl(path, 60)
  if (error) return null
  return data.signedUrl
}

export const deleteMedicalRecord = async (id, filePath) => {
  if (filePath) await supabase.storage.from('medical-records').remove([filePath])
  const { error } = await supabase.from('medical_records').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}