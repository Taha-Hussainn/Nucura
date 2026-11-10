import { useState, useEffect, useMemo } from 'react'
import { Calendar, Settings, LogOut, CheckCircle, XCircle, Filter, MessageCircle, FileText, ShieldAlert, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAppointmentsByDoctor, updateAppointmentStatus } from '../api/appointments'
import { getCurrentUser } from '../api/auth'
import { resubmitForReview } from '../api/doctors'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/client'
import { getChatsByDoctor } from '../api/chat'
import ChatWindow from '../components/ChatWindow'
import { getPrescriptionsByDoctor } from '../api/prescriptions'
import PrescriptionModal from '../components/PrescriptionModal'
import PrescriptionCard from '../components/PrescriptionCard'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import MobileTabs from '../components/MobileTabs'
import { specializations, pakistaniCities } from '../data/specializations'

const profileFields = [
  { label: 'Full Name', key: 'name', kind: 'text', type: 'text' },
  { label: 'Specialization', key: 'specialization', kind: 'specialization' },
  { label: 'PMDC Registration No.', key: 'pmdc_number', kind: 'text', type: 'text', placeholder: 'e.g. 12345-S' },
  { label: 'Experience (years)', key: 'experience', kind: 'text', type: 'number' },
  { label: 'Consultation Fee (Rs.)', key: 'fee', kind: 'text', type: 'number' },
  { label: 'Phone', key: 'phone', kind: 'text', type: 'tel' },
  { label: 'Hospital', key: 'hospital', kind: 'text', type: 'text' },
  { label: 'Clinic', key: 'clinic', kind: 'text', type: 'text' },
  { label: 'City', key: 'location', kind: 'city' },
  { label: 'Available Time', key: 'available_time', kind: 'text', type: 'text', placeholder: '9:00 AM - 5:00 PM' },
  { label: 'Time Slots (comma separated)', key: 'slots', kind: 'text', type: 'text', placeholder: '09:00 AM, 10:30 AM' },
]

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments')
  const [appointments, setAppointments] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [doctorRow, setDoctorRow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [profileData, setProfileData] = useState({
    name: '', specialization: '', pmdc_number: '', experience: '', fee: '',
    phone: '', hospital: '', clinic: '', location: '',
    description: '', available_time: '', slots: '', available_days: []
  })
  const { logout } = useAuth()
  const navigate = useNavigate()

  const loadDoctorRow = (data) => {
    setDoctorRow(data)
    setProfileData({
      name: data.name || '', specialization: data.specialization || '',
      pmdc_number: data.pmdc_number || '',
      experience: data.experience || '', fee: data.fee || '',
      phone: data.contact?.phone || '', hospital: data.hospital || '',
      clinic: data.clinic || '', location: data.location || '',
      description: data.description || '', available_time: data.available_time || '',
      slots: data.slots?.join(', ') || '', available_days: data.available_days || []
    })
  }

  useEffect(() => {
    getCurrentUser().then(user => {
      if (!user) { navigate('/login'); return }
      setCurrentUser(user)
      supabase.from('doctors').select('*').eq('id', user.id).single().then(({ data }) => { if (data) loadDoctorRow(data) })
      getAppointmentsByDoctor(user.id).then(r => { if (r.success) setAppointments(r.data); setLoading(false) })
      getChatsByDoctor(user.id).then(r => { if (r.success) setChats(r.data) })
      getPrescriptionsByDoctor(user.id).then(r => { if (r.success) setPrescriptions(r.data) })
    })
  }, [])

  const specOptions = useMemo(
    () => [...new Set([...specializations, profileData.specialization].filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [profileData.specialization]
  )
  const currentCity = (profileData.location || '').split(',')[0].trim()
  const cityOptions = useMemo(
    () => [...new Set([...pakistaniCities, currentCity].filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [currentCity]
  )

  const handleSaveProfile = async () => {
    setSaving(true)
    setMessage('')
    const slotsArray = profileData.slots ? profileData.slots.split(',').map(s => s.trim()).filter(Boolean) : []
    const { data, error } = await supabase.from('doctors').update({
      name: profileData.name, specialization: profileData.specialization,
      pmdc_number: profileData.pmdc_number.trim() || null,
      experience: parseInt(profileData.experience) || 0, fee: parseInt(profileData.fee) || 0,
      hospital: profileData.hospital, clinic: profileData.clinic, location: profileData.location,
      description: profileData.description, available_time: profileData.available_time,
      slots: slotsArray, available_days: profileData.available_days,
      contact: { phone: profileData.phone, email: currentUser.email, website: '' }
    }).eq('id', currentUser.id).select().single()

    if (error) { setMessage('Could not save: ' + error.message); setSaving(false); return }
    await supabase.from('users').update({ name: profileData.name, specialization: profileData.specialization, phone: profileData.phone }).eq('id', currentUser.id)
    loadDoctorRow(data)
    setMessage(data.verification_status === 'pending' && doctorRow?.verification_status === 'approved'
      ? 'Saved. Because your PMDC number changed, your profile is back in review.'
      : 'Profile saved.')
    setSaving(false)
  }

  const handleResubmit = async () => {
    const result = await resubmitForReview(currentUser.id)
    if (result.success) loadDoctorRow(result.data)
    else setMessage(result.error)
  }

  const setStatus = async (id, status) => {
    const r = await updateAppointmentStatus(id, status)
    if (r.success) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const handleLogout = async () => { await logout(); navigate('/login') }

  const toggleDay = (day) =>
    setProfileData(p => ({ ...p, available_days: p.available_days.includes(day) ? p.available_days.filter(d => d !== day) : [...p.available_days, day] }))

  const filteredAppointments = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)
  const today = new Date().toISOString().split('T')[0]
  const stats = {
    total: appointments.length,
    today: appointments.filter(a => a.date === today && a.status !== 'cancelled').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length
  }

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"

  const navItems = [
    { key: 'appointments', label: 'Appointments', icon: Calendar, count: 0 },
    { key: 'chats', label: 'Patient Chats', icon: MessageCircle, count: chats.length },
    { key: 'prescriptions', label: 'Prescriptions', icon: FileText, count: prescriptions.length },
    { key: 'profile', label: 'My Profile', icon: Settings, count: 0 },
  ]

  const renderField = (field, i) => (
    <div key={field.key} className="animate-slide-left" style={{ animationDelay: `${i * 40}ms` }}>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">{field.label}</label>
      {field.kind === 'specialization' ? (
        <select className={inputClass} value={profileData.specialization}
          onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}>
          <option value="">Select specialization</option>
          {specOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      ) : field.kind === 'city' ? (
        <select className={inputClass} value={currentCity}
          onChange={(e) => setProfileData({ ...profileData, location: e.target.value ? `${e.target.value}, Pakistan` : '' })}>
          <option value="">Select city</option>
          {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      ) : (
        <input type={field.type} placeholder={field.placeholder || ''}
          inputMode={field.type === 'number' ? 'numeric' : undefined}
          value={profileData[field.key]}
          onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
          className={inputClass} />
      )}
      {field.key === 'pmdc_number' && doctorRow?.verification_status === 'approved' && (
        <p className="text-xs text-amber-600 mt-1">Changing this sends your profile back for review.</p>
      )}
    </div>
  )

  const status = doctorRow?.verification_status

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-6 sm:py-8">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="animate-slide-left min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Doctor Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1 truncate">Welcome back, {currentUser?.name || 'Doctor'}</p>
          </div>
          <button onClick={handleLogout}
            className="animate-slide-right flex-shrink-0 flex items-center px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 text-sm transition">
            <LogOut className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 -mt-12 sm:-mt-14 relative z-10">
          {[
            { label: 'Total Appointments', value: stats.total },
            { label: "Today's", value: stats.today },
            { label: 'Pending Requests', value: stats.pending },
            { label: 'Completed', value: stats.completed }
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 100} variant="scale">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-blue-900/5 p-4 sm:p-5 card-lift">
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900"><CountUp value={s.value} /></p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Verification status banner */}
        {doctorRow && status !== 'approved' && (
          <div className={`mb-6 rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 animate-scale-in ${
            status === 'pending' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
              {status === 'pending' ? <Clock className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${status === 'pending' ? 'text-amber-800' : 'text-red-800'}`}>
                {status === 'pending' && 'Your profile is under review'}
                {status === 'rejected' && 'Your profile was not approved'}
                {status === 'suspended' && 'Your listing is suspended'}
              </p>
              <p className={`text-xs mt-1 ${status === 'pending' ? 'text-amber-700' : 'text-red-700'}`}>
                {status === 'pending' && "Patients can't find or book you until an admin approves your profile. Complete My Profile, including your PMDC number."}
                {status === 'rejected' && `Reason: ${doctorRow.rejection_reason || 'not given'}. Update your details in My Profile, then resubmit.`}
                {status === 'suspended' && `${doctorRow.rejection_reason ? `Reason: ${doctorRow.rejection_reason}. ` : ''}Contact support@nucura.com.`}
              </p>
            </div>
            {status === 'rejected' && (
              <button onClick={handleResubmit}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 active:scale-95 transition">
                Resubmit for review
              </button>
            )}
          </div>
        )}

        <MobileTabs items={navItems} active={activeTab} onChange={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block lg:col-span-1 animate-slide-left">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center space-x-3 mb-5 pb-5 border-b border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{currentUser?.name?.charAt(0)?.toUpperCase() || 'D'}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{currentUser?.name || 'Doctor'}</h3>
                  <p className="text-blue-600 text-xs truncate">{profileData.specialization || 'Doctor'}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {navItems.map(item => (
                  <button key={item.key} onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === item.key ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                    }`}>
                    <item.icon className="h-4 w-4 mr-3" />{item.label}
                    {item.count > 0 && (
                      <span className={`ml-auto text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                        activeTab === item.key ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                      }`}>{item.count}</span>
                    )}
                  </button>
                ))}
                <button onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
                  <LogOut className="h-4 w-4 mr-3" />Logout
                </button>
              </nav>
            </div>
          </div>

          <div key={activeTab} className="lg:col-span-3 min-w-0 animate-fade-up">
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex justify-between items-center gap-3">
                  <h2 className="font-semibold text-slate-900">Appointments ({filteredAppointments.length})</h2>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 focus:outline-none bg-white"
                      value={filter} onChange={(e) => setFilter(e.target.value)}>
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                {loading ? (
                  <div className="p-4 sm:p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl skeleton" />)}</div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="p-10 text-center">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-400 text-sm">No appointments found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {filteredAppointments.map((apt, i) => (
                      <div key={apt.id} style={{ animationDelay: `${Math.min(i, 6) * 80}ms` }}
                        className="animate-fade-up p-4 sm:p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 break-words">{apt.patient_name}</h3>
                            <div className="flex flex-col gap-0.5 mt-1 text-xs text-slate-400">
                              <span className="break-all">{apt.patient_email}</span>
                              {apt.patient_phone && <span>{apt.patient_phone}</span>}
                            </div>
                            {apt.symptoms && <p className="text-slate-500 text-xs mt-1.5 break-words">Symptoms: {apt.symptoms}</p>}
                          </div>
                          <div className="sm:text-right flex-shrink-0">
                            <div className="flex sm:block items-baseline gap-3">
                              <div className="font-bold text-slate-900">{apt.time}</div>
                              <div className="text-slate-400 text-xs">{apt.date}</div>
                              <div className="text-blue-600 text-xs font-medium sm:mt-1 ml-auto sm:ml-0">Rs. {apt.fee}</div>
                            </div>
                            <div className="mt-2">
                              {apt.status === 'pending' ? (
                                <div className="flex gap-2 sm:justify-end">
                                  <button onClick={() => setStatus(apt.id, 'confirmed')}
                                    className="flex-1 sm:flex-none px-4 py-2.5 bg-teal-600 text-white rounded-lg text-xs flex items-center justify-center hover:bg-teal-700 active:scale-95 transition">
                                    <CheckCircle className="h-3 w-3 mr-1" />Approve
                                  </button>
                                  <button onClick={() => setStatus(apt.id, 'cancelled')}
                                    className="flex-1 sm:flex-none px-4 py-2.5 bg-red-500 text-white rounded-lg text-xs flex items-center justify-center hover:bg-red-600 active:scale-95 transition">
                                    <XCircle className="h-3 w-3 mr-1" />Reject
                                  </button>
                                </div>
                              ) : (
                                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                                  apt.status === 'confirmed' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                  apt.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                  'bg-red-50 text-red-600 border border-red-200'
                                }`}>{apt.status}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {(apt.status === 'confirmed' || apt.status === 'completed') && (
                          <div className="mt-3 flex flex-col sm:flex-row sm:justify-end gap-2">
                            {apt.status === 'confirmed' && (
                              <button onClick={() => setStatus(apt.id, 'completed')}
                                className="px-4 py-2.5 bg-white text-teal-700 border border-teal-200 rounded-lg text-xs font-medium flex items-center justify-center hover:bg-teal-50 active:scale-95 transition">
                                <CheckCircle className="h-3 w-3 mr-1.5" />Mark completed
                              </button>
                            )}
                            <button onClick={() => { setSelectedAppointment(apt); setShowPrescriptionModal(true) }}
                              className="px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium flex items-center justify-center hover:bg-blue-100 active:scale-95 transition">
                              <FileText className="h-3 w-3 mr-1.5" />Write Prescription
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chats' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100"><h2 className="font-semibold text-slate-900">Patient Chats ({chats.length})</h2></div>
                {chats.length === 0 ? (
                  <div className="p-10 text-center">
                    <MessageCircle className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-400 text-sm">No patient chats yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {chats.map((chat, i) => (
                      <div key={chat.id} style={{ animationDelay: `${Math.min(i, 6) * 80}ms` }}
                        className="animate-fade-up p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">{chat.patient_name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 text-sm truncate">{chat.patient_name}</p>
                            <p className="text-slate-400 text-xs">Tap to open chat</p>
                          </div>
                        </div>
                        <button onClick={() => setActiveChat(chat)}
                          className="flex-shrink-0 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-medium flex items-center hover:bg-blue-700 active:scale-95 transition">
                          <MessageCircle className="h-3 w-3 mr-1.5" />Open
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 sm:px-6 py-4 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Prescriptions</h2>
                  <span className="text-xs text-slate-400">{prescriptions.length} total</span>
                </div>
                {prescriptions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                    <FileText className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-400 text-sm">No prescriptions yet.</p>
                    <p className="text-slate-300 text-xs mt-1">Write a prescription from a confirmed appointment.</p>
                  </div>
                ) : prescriptions.map((p, i) => (
                  <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 5) * 100}ms` }}>
                    <PrescriptionCard prescription={p} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
                <h2 className="font-semibold text-slate-900 mb-1">Complete Your Profile</h2>
                <p className="text-slate-400 text-xs mb-5">Fill in your details so patients can find and book you.</p>

                {message && <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm animate-scale-in">{message}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileFields.map(renderField)}
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-2">Days you see patients</label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map(day => (
                      <button key={day} type="button" onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition active:scale-95 ${
                          profileData.available_days.includes(day) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}>{day.slice(0, 3)}</button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
                  <textarea value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    className={`${inputClass} h-24 resize-none`} />
                </div>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="mt-5 w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition active:scale-95 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeChat && <ChatWindow chat={activeChat} currentUser={currentUser} onClose={() => setActiveChat(null)} />}
      {showPrescriptionModal && selectedAppointment && (
        <PrescriptionModal appointment={selectedAppointment} currentUser={currentUser}
          onClose={() => { setShowPrescriptionModal(false); setSelectedAppointment(null) }}
          onCreated={(p) => setPrescriptions(prev => [p, ...prev])} />
      )}
    </div>
  )
}

export default DoctorDashboard