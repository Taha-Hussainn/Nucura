import { useState, useEffect } from 'react'
import { Calendar, Settings, LogOut, CheckCircle, XCircle, Filter, MessageCircle, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAppointmentsByDoctor, updateAppointmentStatus } from '../api/appointments'
import { getCurrentUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/client'
import { getChatsByDoctor } from '../api/chat'
import ChatWindow from '../components/ChatWindow'
import { getPrescriptionsByDoctor } from '../api/prescriptions'
import PrescriptionModal from '../components/PrescriptionModal'
import PrescriptionCard from '../components/PrescriptionCard'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments')
  const [appointments, setAppointments] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [profileData, setProfileData] = useState({
    name: '', specialization: '', experience: '', fee: '',
    phone: '', hospital: '', clinic: '', location: '',
    description: '', available_time: '', slots: ''
  })
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser().then(user => {
      if (!user) { navigate('/login'); return }
      setCurrentUser(user)
      supabase.from('doctors').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) setProfileData({
          name: data.name || '', specialization: data.specialization || '',
          experience: data.experience || '', fee: data.fee || '',
          phone: data.contact?.phone || '', hospital: data.hospital || '',
          clinic: data.clinic || '', location: data.location || '',
          description: data.description || '', available_time: data.available_time || '',
          slots: data.slots?.join(', ') || ''
        })
      })
      getAppointmentsByDoctor(user.id).then(r => { if (r.success) setAppointments(r.data); setLoading(false) })
      getChatsByDoctor(user.id).then(r => { if (r.success) setChats(r.data) })
      getPrescriptionsByDoctor(user.id).then(r => { if (r.success) setPrescriptions(r.data) })
    })
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    const slotsArray = profileData.slots ? profileData.slots.split(',').map(s => s.trim()).filter(Boolean) : []
    await supabase.from('doctors').update({
      name: profileData.name, specialization: profileData.specialization,
      experience: parseInt(profileData.experience) || 0, fee: parseInt(profileData.fee) || 0,
      hospital: profileData.hospital, clinic: profileData.clinic, location: profileData.location,
      description: profileData.description, available_time: profileData.available_time, slots: slotsArray,
      contact: { phone: profileData.phone, email: currentUser.email, website: '' }
    }).eq('id', currentUser.id)
    await supabase.from('users').update({ name: profileData.name, specialization: profileData.specialization, phone: profileData.phone }).eq('id', currentUser.id)
    setSaving(false)
    alert('Profile updated!')
  }

  const handleApprove = async (id) => {
    const r = await updateAppointmentStatus(id, 'confirmed')
    if (r.success) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed' } : a))
  }

  const handleReject = async (id) => {
    const r = await updateAppointmentStatus(id, 'cancelled')
    if (r.success) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
  }

  const handleLogout = async () => { await logout(); navigate('/login') }

  const filteredAppointments = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)
  const today = new Date().toISOString().split('T')[0]
  const stats = {
    totalAppointments: appointments.length,
    todayAppointments: appointments.filter(a => a.date === today).length,
    pendingApprovals: appointments.filter(a => a.status === 'pending').length,
    totalEarnings: appointments.filter(a => a.status === 'confirmed').reduce((sum, a) => sum + (a.fee || 0), 0)
  }

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"

  const navItems = [
    { key: 'appointments', label: 'Appointments', icon: <Calendar className="h-4 w-4 mr-3" />, badge: 0 },
    { key: 'chats', label: 'Patient Chats', icon: <MessageCircle className="h-4 w-4 mr-3" />, badge: chats.length },
    { key: 'prescriptions', label: 'Prescriptions', icon: <FileText className="h-4 w-4 mr-3" />, badge: prescriptions.length },
    { key: 'profile', label: 'My Profile', icon: <Settings className="h-4 w-4 mr-3" />, badge: 0 },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-8">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="animate-slide-left">
            <h1 className="text-2xl font-bold text-white">Doctor Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">Welcome back, {currentUser?.name || 'Doctor'}</p>
          </div>
          <button onClick={handleLogout}
            className="animate-slide-right flex items-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 text-sm transition">
            <LogOut className="h-4 w-4 mr-2" />Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-14 relative z-10">
          {[
            { label: 'Total Appointments', node: <CountUp value={stats.totalAppointments} /> },
            { label: "Today's", node: <CountUp value={stats.todayAppointments} /> },
            { label: 'Pending', node: <CountUp value={stats.pendingApprovals} /> },
            { label: 'Earnings', node: <CountUp value={stats.totalEarnings} prefix="Rs. " /> }
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 100} variant="scale">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-blue-900/5 p-5 card-lift">
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{s.node}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 animate-slide-left">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center space-x-3 mb-5 pb-5 border-b border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{currentUser?.name?.charAt(0)?.toUpperCase() || 'D'}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{currentUser?.name || 'Doctor'}</h3>
                  <p className="text-blue-600 text-xs">{currentUser?.specialization || 'Doctor'}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {navItems.map(item => (
                  <button key={item.key} onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === item.key ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                    }`}>
                    {item.icon}{item.label}
                    {item.badge > 0 && (
                      <span className={`ml-auto text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                        activeTab === item.key ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                      }`}>{item.badge}</span>
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

          <div key={activeTab} className="lg:col-span-3 animate-fade-up">
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="font-semibold text-slate-900">Appointments ({filteredAppointments.length})</h2>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 focus:outline-none"
                      value={filter} onChange={(e) => setFilter(e.target.value)}>
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                {loading ? (
                  <div className="p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl skeleton" />)}</div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-400 text-sm">No appointments found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {filteredAppointments.map((apt, i) => (
                      <div key={apt.id} style={{ animationDelay: `${Math.min(i, 6) * 80}ms` }}
                        className="animate-fade-up p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-slate-900">{apt.patient_name}</h3>
                            <div className="flex items-center space-x-3 mt-1 text-xs text-slate-400">
                              <span>{apt.patient_email}</span>
                              {apt.patient_phone && <span>{apt.patient_phone}</span>}
                            </div>
                            {apt.symptoms && <p className="text-slate-500 text-xs mt-1.5">Symptoms: {apt.symptoms}</p>}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">{apt.time}</div>
                            <div className="text-slate-400 text-xs">{apt.date}</div>
                            <div className="text-blue-600 text-xs font-medium mt-1">Rs. {apt.fee}</div>
                            <div className="mt-2">
                              {apt.status === 'pending' ? (
                                <div className="flex space-x-1.5">
                                  <button onClick={() => handleApprove(apt.id)}
                                    className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs flex items-center hover:bg-teal-700 active:scale-95 transition">
                                    <CheckCircle className="h-3 w-3 mr-1" />Approve
                                  </button>
                                  <button onClick={() => handleReject(apt.id)}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs flex items-center hover:bg-red-600 active:scale-95 transition">
                                    <XCircle className="h-3 w-3 mr-1" />Reject
                                  </button>
                                </div>
                              ) : (
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                                  apt.status === 'confirmed' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                  apt.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-200' :
                                  'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>{apt.status}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button onClick={() => { setSelectedAppointment(apt); setShowPrescriptionModal(true) }}
                            className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium flex items-center hover:bg-blue-100 active:scale-95 transition">
                            <FileText className="h-3 w-3 mr-1.5" />Write Prescription
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chats' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100"><h2 className="font-semibold text-slate-900">Patient Chats ({chats.length})</h2></div>
                {chats.length === 0 ? (
                  <div className="p-12 text-center">
                    <MessageCircle className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-400 text-sm">No patient chats yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {chats.map((chat, i) => (
                      <div key={chat.id} style={{ animationDelay: `${Math.min(i, 6) * 80}ms` }}
                        className="animate-fade-up p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">{chat.patient_name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{chat.patient_name}</p>
                            <p className="text-slate-400 text-xs">Tap to open chat</p>
                          </div>
                        </div>
                        <button onClick={() => setActiveChat(chat)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium flex items-center hover:bg-blue-700 active:scale-95 transition">
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
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Prescriptions</h2>
                  <span className="text-xs text-slate-400">{prescriptions.length} total</span>
                </div>
                {prescriptions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <FileText className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-400 text-sm">No prescriptions yet.</p>
                    <p className="text-slate-300 text-xs mt-1">Write a prescription from the Appointments tab.</p>
                  </div>
                ) : prescriptions.map((p, i) => (
                  <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 5) * 100}ms` }}>
                    <PrescriptionCard prescription={p} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-semibold text-slate-900 mb-1">Complete Your Profile</h2>
                <p className="text-slate-400 text-xs mb-5">Fill in your details so patients can find and book you.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text' },
                    { label: 'Specialization', key: 'specialization', type: 'text' },
                    { label: 'Experience (years)', key: 'experience', type: 'number' },
                    { label: 'Consultation Fee (Rs.)', key: 'fee', type: 'number' },
                    { label: 'Phone', key: 'phone', type: 'text' },
                    { label: 'Hospital', key: 'hospital', type: 'text' },
                    { label: 'Clinic', key: 'clinic', type: 'text' },
                    { label: 'Location', key: 'location', type: 'text' },
                    { label: 'Available Time', key: 'available_time', type: 'text' },
                    { label: 'Time Slots (comma separated)', key: 'slots', type: 'text', placeholder: '09:00 AM, 10:30 AM' },
                  ].map((field, i) => (
                    <div key={field.key} className="animate-slide-left" style={{ animationDelay: `${i * 50}ms` }}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{field.label}</label>
                      <input type={field.type} placeholder={field.placeholder || ''}
                        value={profileData[field.key]}
                        onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                        className={inputClass} />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
                  <textarea value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    className={`${inputClass} h-24 resize-none`} />
                </div>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="mt-5 bg-blue-600 text-white px-8 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition active:scale-95 disabled:opacity-50">
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