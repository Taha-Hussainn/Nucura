import { useState, useEffect } from 'react'
import { Calendar, Clock, User, LogOut, Plus, Trash2, MessageCircle, FileText, Upload, File, Download } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getAppointmentsByUser, updateAppointmentStatus, deleteAppointment } from '../api/appointments'
import { getCurrentUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { getChatsByPatient } from '../api/chat'
import ChatWindow from '../components/ChatWindow'
import { getPrescriptionsByPatient } from '../api/prescriptions'
import PrescriptionCard from '../components/PrescriptionCard'
import { uploadMedicalRecord, getMedicalRecordsByPatient, deleteMedicalRecord } from '../api/medicalRecords'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import MobileTabs from '../components/MobileTabs'

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [records, setRecords] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({ category: 'Lab Report', description: '' })
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser().then(user => {
      if (!user) { navigate('/login'); return }
      setCurrentUser(user)
      getAppointmentsByUser(user.id).then(r => { if (r.success) setAppointments(r.data); setLoading(false) })
      getChatsByPatient(user.id).then(r => { if (r.success) setChats(r.data) })
      getPrescriptionsByPatient(user.id).then(r => { if (r.success) setPrescriptions(r.data) })
      getMedicalRecordsByPatient(user.id).then(r => { if (r.success) setRecords(r.data) })
    })
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    const result = await updateAppointmentStatus(id, 'cancelled')
    if (result.success) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return
    const result = await deleteAppointment(id)
    if (result.success) setAppointments(prev => prev.filter(a => a.id !== id))
  }

  const handleLogout = async () => { await logout(); navigate('/login') }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const result = await uploadMedicalRecord(currentUser.id, currentUser.name, file, uploadForm.category, uploadForm.description)
    if (result.success) { setRecords(prev => [result.data, ...prev]); alert('File uploaded successfully!') }
    else alert('Upload failed: ' + result.error)
    setUploading(false)
    e.target.value = ''
  }

  const handleDeleteRecord = async (id, fileUrl) => {
    if (!window.confirm('Delete this record?')) return
    const result = await deleteMedicalRecord(id, fileUrl)
    if (result.success) setRecords(prev => prev.filter(r => r.id !== id))
  }

  const statusColor = (status) => {
    if (status === 'confirmed') return 'bg-teal-50 text-teal-700 border border-teal-200'
    if (status === 'pending') return 'bg-amber-50 text-amber-700 border border-amber-200'
    if (status === 'cancelled') return 'bg-red-50 text-red-700 border border-red-200'
    return 'bg-slate-100 text-slate-600'
  }

  const navItems = [
    { key: 'appointments', label: 'Appointments', icon: Calendar, count: appointments.length },
    { key: 'chats', label: 'My Chats', icon: MessageCircle, count: chats.length },
    { key: 'prescriptions', label: 'Prescriptions', icon: FileText, count: prescriptions.length },
    { key: 'records', label: 'Medical Records', icon: Upload, count: records.length },
    { key: 'profile', label: 'Profile', icon: User, count: 0 },
  ]

  const stats = [
    { label: 'Appointments', value: appointments.length, color: 'bg-blue-50 text-blue-600', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: 'bg-amber-50 text-amber-600', icon: <Clock className="h-5 w-5" /> },
    { label: 'Prescriptions', value: prescriptions.length, color: 'bg-teal-50 text-teal-600', icon: <FileText className="h-5 w-5" /> },
    { label: 'Records', value: records.length, color: 'bg-indigo-50 text-indigo-600', icon: <Upload className="h-5 w-5" /> },
  ]

  const inputClass = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-6 sm:py-8">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="animate-slide-left min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">My Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1 truncate">Welcome back, {currentUser?.name || '...'}</p>
          </div>
          <Link to="/doctors"
            className="animate-slide-right bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold flex items-center justify-center text-sm active:scale-95 transition-transform shadow-lg">
            <Plus className="h-4 w-4 mr-2" />New Appointment
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 -mt-12 sm:-mt-14 relative z-10">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} variant="scale">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-blue-900/5 p-4 sm:p-5 card-lift">
                <div className={`inline-flex items-center justify-center w-9 h-9 ${s.color} rounded-xl mb-3`}>{s.icon}</div>
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900"><CountUp value={s.value} /></p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile tab bar */}
        <MobileTabs items={navItems} active={activeTab} onChange={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar (desktop only) */}
          <div className="hidden lg:block lg:col-span-1 animate-slide-left">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{currentUser?.name || 'Loading...'}</h3>
                  <p className="text-slate-400 text-xs truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-200">Patient</span>
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
                  className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all mt-2">
                  <LogOut className="h-4 w-4 mr-3" />Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main */}
          <div key={activeTab} className="lg:col-span-3 min-w-0 animate-fade-up">
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">My Appointments</h2>
                  <span className="text-xs text-slate-400">{appointments.length} total</span>
                </div>
                {loading ? (
                  <div className="p-4 sm:p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl skeleton" />)}</div>
                ) : appointments.length === 0 ? (
                  <div className="p-10 text-center">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-500 text-sm">No appointments yet.</p>
                    <Link to="/doctors" className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block">Book your first appointment</Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {appointments.map((apt, i) => (
                      <div key={apt.id} style={{ animationDelay: `${Math.min(i, 6) * 80}ms` }}
                        className="animate-fade-up p-4 sm:p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 break-words">{apt.doctor_name}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                              <span className="flex items-center text-slate-500 text-xs"><Calendar className="h-3 w-3 mr-1" />{apt.date}</span>
                              <span className="flex items-center text-slate-500 text-xs"><Clock className="h-3 w-3 mr-1" />{apt.time}</span>
                            </div>
                            {apt.symptoms && <p className="text-slate-400 text-xs mt-1.5 break-words">{apt.symptoms}</p>}
                          </div>
                          <div className="flex items-center justify-between sm:block sm:text-right flex-shrink-0">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${statusColor(apt.status)}`}>{apt.status}</span>
                            <p className="text-lg font-bold text-slate-900 sm:mt-1.5">Rs. {apt.fee}</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          {apt.status === 'pending' && (
                            <button onClick={() => handleCancel(apt.id)}
                              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-xs font-medium active:scale-95 transition">
                              Cancel
                            </button>
                          )}
                          <button onClick={() => handleDelete(apt.id)}
                            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs text-slate-500 flex items-center active:scale-95 transition">
                            <Trash2 className="h-3 w-3 mr-1" />Delete
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
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100"><h2 className="font-semibold text-slate-900">My Chats</h2></div>
                {chats.length === 0 ? (
                  <div className="p-10 text-center">
                    <MessageCircle className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-500 text-sm">No chats yet.</p>
                    <p className="text-slate-400 text-xs mt-1">Book an appointment to start chatting with a doctor.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {chats.map((chat, i) => (
                      <div key={chat.id} style={{ animationDelay: `${Math.min(i, 6) * 80}ms` }}
                        className="animate-fade-up p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 font-bold text-sm">Dr</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 text-sm truncate">{chat.doctor_name}</p>
                            <p className="text-slate-400 text-xs">Tap to open chat</p>
                          </div>
                        </div>
                        <button onClick={() => setActiveChat(chat)}
                          className="flex-shrink-0 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-xs font-medium flex items-center active:scale-95 transition">
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
                  <h2 className="font-semibold text-slate-900">My Prescriptions</h2>
                  <span className="text-xs text-slate-400">{prescriptions.length} total</span>
                </div>
                {prescriptions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                    <FileText className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-500 text-sm">No prescriptions yet.</p>
                    <p className="text-slate-400 text-xs mt-1">Your doctor will add prescriptions after your appointment.</p>
                  </div>
                ) : prescriptions.map((p, i) => (
                  <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 5) * 100}ms` }}>
                    <PrescriptionCard prescription={p} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'records' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">Medical Records</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
                      <select className={inputClass} value={uploadForm.category}
                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}>
                        {['Lab Report', 'X-Ray', 'MRI Scan', 'CT Scan', 'Ultrasound', 'Prescription', 'Discharge Summary', 'Other'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Description (Optional)</label>
                      <input type="text" placeholder="e.g. Blood test results" className={inputClass}
                        value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} />
                    </div>
                  </div>
                  <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                    uploading ? 'border-slate-200 bg-slate-50' : 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
                  }`}>
                    <Upload className={`h-6 w-6 mb-2 ${uploading ? 'text-slate-400 animate-pulse' : 'text-blue-500 animate-floaty'}`} />
                    <p className="text-sm font-medium text-slate-600">{uploading ? 'Uploading...' : 'Tap to upload file'}</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>

                {records.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 text-sm">Uploaded Records</h3>
                      <span className="text-xs text-slate-400">{records.length} files</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {records.map((record, i) => (
                        <div key={record.id} style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}
                          className="animate-fade-up p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <File className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-800 text-sm truncate">{record.file_name}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{record.category}</span>
                                <span className="text-xs text-slate-400">{record.file_size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <a href={record.file_url} target="_blank" rel="noopener noreferrer" aria-label="Download"
                              className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Download className="h-4 w-4" /></a>
                            <button onClick={() => handleDeleteRecord(record.id, record.file_url)} aria-label="Delete"
                              className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
                <h2 className="font-semibold text-slate-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', type: 'text', value: currentUser?.name, disabled: false },
                    { label: 'Email', type: 'email', value: currentUser?.email, disabled: true },
                    { label: 'Phone', type: 'tel', value: currentUser?.phone, disabled: false },
                  ].map((field, i) => (
                    <div key={i} className="animate-slide-left" style={{ animationDelay: `${i * 100}ms` }}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{field.label}</label>
                      <input type={field.type} defaultValue={field.value} disabled={field.disabled}
                        className={`${inputClass} py-3 ${field.disabled ? 'bg-slate-50 text-slate-400' : ''}`} />
                    </div>
                  ))}
                  <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition active:scale-95">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeChat && <ChatWindow chat={activeChat} currentUser={currentUser} onClose={() => setActiveChat(null)} />}
    </div>
  )
}

export default UserDashboard