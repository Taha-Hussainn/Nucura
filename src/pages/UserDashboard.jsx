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
    { key: 'appointments', label: 'Appointments', icon: <Calendar className="h-4 w-4 mr-3" />, count: appointments.length },
    { key: 'chats', label: 'My Chats', icon: <MessageCircle className="h-4 w-4 mr-3" />, count: chats.length },
    { key: 'prescriptions', label: 'Prescriptions', icon: <FileText className="h-4 w-4 mr-3" />, count: prescriptions.length },
    { key: 'records', label: 'Medical Records', icon: <Upload className="h-4 w-4 mr-3" />, count: records.length },
    { key: 'profile', label: 'Profile', icon: <User className="h-4 w-4 mr-3" />, count: 0 },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, {currentUser?.name}</p>
          </div>
          <Link to="/doctors"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center text-sm transition-all shadow-sm">
            <Plus className="h-4 w-4 mr-2" />New Appointment
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-lg">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{currentUser?.name || 'Loading...'}</h3>
                  <p className="text-slate-400 text-xs truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-200">Patient</span>
                </div>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {navItems.map(item => (
                  <button key={item.key} onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.key ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}>
                    {item.icon}{item.label}
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

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">My Appointments</h2>
                  <span className="text-xs text-slate-400">{appointments.length} total</span>
                </div>
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-500 text-sm">No appointments yet.</p>
                    <Link to="/doctors" className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block">
                      Book your first appointment
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-slate-900">{apt.doctor_name}</h3>
                            <div className="flex items-center space-x-4 mt-1.5">
                              <span className="flex items-center text-slate-500 text-xs">
                                <Calendar className="h-3 w-3 mr-1" />{apt.date}
                              </span>
                              <span className="flex items-center text-slate-500 text-xs">
                                <Clock className="h-3 w-3 mr-1" />{apt.time}
                              </span>
                            </div>
                            {apt.symptoms && <p className="text-slate-400 text-xs mt-1.5">{apt.symptoms}</p>}
                          </div>
                          <div className="text-right">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${statusColor(apt.status)}`}>
                              {apt.status}
                            </span>
                            <p className="text-lg font-bold text-slate-900 mt-1.5">Rs. {apt.fee}</p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                          {apt.status === 'pending' && (
                            <button onClick={() => handleCancel(apt.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-xs font-medium">
                              Cancel
                            </button>
                          )}
                          <button onClick={() => handleDelete(apt.id)}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs text-slate-500 flex items-center">
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
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-900">My Chats</h2>
                </div>
                {chats.length === 0 ? (
                  <div className="p-12 text-center">
                    <MessageCircle className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-500 text-sm">No chats yet.</p>
                    <p className="text-slate-400 text-xs mt-1">Book an appointment to start chatting with a doctor.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {chats.map(chat => (
                      <div key={chat.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-blue-700 font-bold text-sm">Dr</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{chat.doctor_name}</p>
                            <p className="text-slate-400 text-xs">Tap to open chat</p>
                          </div>
                        </div>
                        <button onClick={() => setActiveChat(chat)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-xs font-medium flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1.5" />Open Chat
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
                  <h2 className="font-semibold text-slate-900">My Prescriptions</h2>
                  <span className="text-xs text-slate-400">{prescriptions.length} total</span>
                </div>
                {prescriptions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <FileText className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-500 text-sm">No prescriptions yet.</p>
                    <p className="text-slate-400 text-xs mt-1">Your doctor will add prescriptions after your appointment.</p>
                  </div>
                ) : (
                  prescriptions.map(p => <PrescriptionCard key={p.id} prescription={p} />)
                )}
              </div>
            )}

            {activeTab === 'records' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">Medical Records</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
                      <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}>
                        {['Lab Report', 'X-Ray', 'MRI Scan', 'CT Scan', 'Ultrasound', 'Prescription', 'Discharge Summary', 'Other'].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Description (Optional)</label>
                      <input type="text" placeholder="e.g. Blood test results"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} />
                    </div>
                  </div>
                  <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    uploading ? 'border-slate-200 bg-slate-50' : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                  }`}>
                    <Upload className={`h-6 w-6 mb-2 ${uploading ? 'text-slate-400' : 'text-blue-500'}`} />
                    <p className="text-sm font-medium text-slate-600">{uploading ? 'Uploading...' : 'Click to upload file'}</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>

                {records.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 text-sm">Uploaded Records</h3>
                      <span className="text-xs text-slate-400">{records.length} files</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {records.map(record => (
                        <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                              <File className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 text-sm">{record.file_name}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{record.category}</span>
                                <span className="text-xs text-slate-400">{record.file_size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a href={record.file_url} target="_blank" rel="noopener noreferrer"
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                              <Download className="h-4 w-4" />
                            </a>
                            <button onClick={() => handleDeleteRecord(record.id, record.file_url)}
                              className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-semibold text-slate-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', type: 'text', value: currentUser?.name, disabled: false },
                    { label: 'Email', type: 'email', value: currentUser?.email, disabled: true },
                    { label: 'Phone', type: 'text', value: currentUser?.phone, disabled: false },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{field.label}</label>
                      <input type={field.type} defaultValue={field.value} disabled={field.disabled}
                        className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${field.disabled ? 'bg-slate-50 text-slate-400' : 'bg-white'}`} />
                    </div>
                  ))}
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all">
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