import { supabase } from '../supabase/client'

const buildUser = (authUser, profile) => ({
  id: authUser.id,
  email: authUser.email,
  ...profile,
  userType: profile.user_type
})

export const signUp = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // The database trigger creates the users/doctors rows from this metadata
        data: {
          name: userData.name || '',
          user_type: userData.userType === 'doctor' ? 'doctor' : 'patient',
          phone: userData.phone || '',
          address: userData.address || '',
          specialization: userData.specialization || '',
          experience: userData.experience || '',
          pmdc_number: userData.pmdcNumber || ''
        }
      }
    })
    if (error) return { success: false, error: error.message }

    // Email confirmation is switched on in Supabase: no session yet
    if (!data.session) return { success: true, needsConfirmation: true }

    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single()
    if (!profile) {
      return { success: false, error: 'Account created but profile is missing. Please contact support.' }
    }
    return { success: true, user: buildUser(data.user, profile) }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }

    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single()
    if (!profile) {
      await supabase.auth.signOut()
      return { success: false, error: 'Account not found.' }
    }
    if (profile.is_active === false) {
      await supabase.auth.signOut()
      return { success: false, error: 'Your account has been deactivated by the admin.' }
    }
    return { success: true, user: buildUser(data.user, profile) }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const logout = async () => {
  await supabase.auth.signOut()
  return { success: true }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
    if (!profile || profile.is_active === false) {
      await supabase.auth.signOut()
      return null
    }
    return buildUser(user, profile)
  } catch {
    return null
  }
}

export const requestPasswordReset = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export const updatePassword = async (password) => {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { success: false, error: error.message }
  return { success: true }
}