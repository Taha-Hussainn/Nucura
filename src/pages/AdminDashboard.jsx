import { useState, useEffect } from 'react'
import { Users, Stethoscope, Calendar, LogOut, Shield, ShieldCheck, Trash2, BadgeCheck, Mail, Phone, MapPin, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchAllDoctorsAdmin, setDoctorStatus, deleteDoctor } from '../api/doctors'
import { getAllAppointments, updateAppointmentStatus } from '../api/appointments'
import { getCurrentUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import MobileTabs from '../components/MobileTabs'

const apptColor = (status) => {
  if (status === 'confirmed') return 'bg-teal-50 text-teal-700 border border-teal-200'
  if (status === 'pending') return 'bg-amber-50 text-amber-700 border border-amber-200'
  if (status === 'completed') return 'bg-blue-50 text-blue-700 border border-blue-200'
  if (status === 'cancelled') return 'bg-red-50 text-red-600 border border-red-200'
  return 'bg-slate-100 text-slate-600'
}

const docColor = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-teal-50 text-teal-700 border-teal-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
  suspended: 'bg-slate-100 text-slate-600 border-slate-200'
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('verification')
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [admin, setAdmin] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [busyId, setBusyId] = useState(null)
  const [reasonModal, setReasonModal] = useState(null) // { doctor, status }
  const [reason, setReason] = useState('')
  const [notice, setNotice] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser().then(setAdmin)
    fetchAllDoctorsAdmin().then(({ data, error }) => { setDoctors(data); setLoadError(error || '') })
    getAllAppointments().then(result => { if (result.success) setAppointments(result.data); setLoading(false) })
  }, [])

  const handleLogout = async () => { await logout(); navigate('/login') }

  const flash = (msg) => { setNotice(msg); setTimeout(() => setNotice(''), 4000) }

  const changeStatus = async (doctor, status, why = '') => {
    setBusyId(doctor.id)
    const result = await setDoctorStatus(doctor.id, status, admin?.id, why)
    setBusyId(null)
    if (result.success) {
      setDoctors(prev => prev.map(d => d.id === doctor.id ? result.data : d))
      flash(`${doctor.name}: ${status}`)
    } else flash('Failed: ' + result.error)
  }

  const confirmReason = async () => {
    if (!reason.trim()) return
    await changeStatus(reasonModal.doctor, reasonModal.status, reason.trim())
    setReasonModal(null)
    setReason('')
  }

  const handleDelete = async (doctor) => {
    if (!window.confirm(`Permanently delete ${doctor.name}? This cannot be undone.`)) return
    setBusyId(doctor.id)
    const result = await deleteDoctor(doctor.id)
    setBusyId(null)
    if (result.success) setDoctors(prev => prev.filter(d => d.id !== doctor.id))
    else flash(result.error)
  }

  const handleApptStatus = async (id, status) => {
    const result = await updateAppointmentStatus(id, status)
    if (result.success) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const pendingDoctors = doctors.filter(d => d.verification_status === 'pending')
  const shownDoctors = statusFilter === 'all' ? doctors : doctors.filter(d => d.verification_status === statusFilter)

  const statCards = [
    { label: 'Total Doctors', node: <CountUp value={doctors.length} />, icon: <Stethoscope className="h-5 w-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Awaiting Review', node: <CountUp value={pendingDoctors.length} />, icon: <BadgeCheck className="h-5 w-5" />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Appointments', node: <CountUp value={appointments.length} />, icon: <Calendar className="h-5 w-5" />, color: 'bg-teal-50 text-teal-600' },
    { label: 'Pending Requests', node: <CountUp value={appointments.filter(a => a.status === 'pending').length} />, icon: <Users className="h-5 w-5" />, color: 'bg-indigo-50 text-indigo-600' }
  ]

  const navItems = [
    { key: 'verification', label: 'Verification', icon: BadgeCheck, count: pendingDoctors.length },
    { key: 'doctors', label: 'All Doctors', icon: Stethoscope, count: 0 },
    { key: 'appointments', label: 'Appointments', icon: Calendar, count: 0 },
  ]

  const ApptActions = ({ apt }) => (
    <div className="flex gap-2">
      {apt.status === 'pending' && (
        <button onClick={() => handleApptStatus(apt.id, 'confirmed')}
          className="px-3 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-xs font-medium hover:bg-teal-100 active:scale-95 transition">Confirm</button>
      )}
      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
        <button onClick={() => handleApptStatus(apt.id, 'cancelled')}
          className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 active:scale-95 transition">Cancel</button>
      )}
    </div>
  )

  const DoctorRow = ({ doctor, showReview }) => {
    const busy = busyId === doctor.id
    const btn = 'px-3 py-2 rounded-lg text-xs font-medium border active:scale-95 transition disabled:opacity-50'
    return (
      <div className="p-4 sm:p-5 hover:bg-slate-50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900 break-words">{doctor.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${docColor[doctor.verification_status]}`}>
                {doctor.verification_status}
              </span>
            </div>
            <p className="text-blue-600 text-sm">{doctor.specialization}</p>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center">
                <BadgeCheck className="h-3 w-3 mr-1.5 flex-shrink-0" />
                PMDC: {doctor.pmdc_number ? <strong className="ml-1 text-slate-700">{doctor.pmdc_number}</strong> : <span className="ml-1 text-red-500">not provided</span>}
              </span>
              <span>{doctor.experience || 0} yrs • Rs. {doctor.fee || 0}</span>
              {doctor.contact?.email && <span className="flex items-center break-all"><Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />{doctor.contact.email}</span>}
              {doctor.contact?.phone && <span className="flex items-center"><Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />{doctor.contact.phone}</span>}
              {(doctor.hospital || doctor.location) && (
                <span className="flex items-center sm:col-span-2"><MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />{[doctor.hospital, doctor.location].filter(Boolean).join(', ')}</span>
              )}
            </div>
            {doctor.qualification && <p className="mt-1 text-xs text-slate-400">{doctor.qualification}</p>}
            {doctor.rejection_reason && (doctor.verification_status === 'rejected' || doctor.verification_status === 'suspended') && (
              <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">Reason: {doctor.rejection_reason}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end flex-shrink-0">
            {(doctor.verification_status === 'pending' || doctor.verification_status === 'rejected' || doctor.verification_status === 'suspended') && (
              <button disabled={busy} onClick={() => changeStatus(doctor, 'approved')}
                className={`${btn} bg-teal-600 text-white border-teal-600 hover:bg-teal-700`}>
                {doctor.verification_status === 'pending' ? 'Approve' : 'Reinstate'}
              </button>
            )}
            {doctor.verification_status === 'pending' && (
              <button disabled={busy} onClick={() => { setReasonModal({ doctor, status: 'rejected' }); setReason('') }}
                className={`${btn} bg-red-50 text-red-600 border-red-200 hover:bg-red-100`}>Reject</button>
            )}
            {doctor.verification_status === 'approved' && (
              <button disabled={busy} onClick={() => { setReasonModal({ doctor, status: 'suspended' }); setReason('') }}
                className={`${btn} bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100`}>Suspend</button>
            )}
            {!showReview && (
              <button disabled={busy} onClick={() => handleDelete(doctor)}
                className={`${btn} bg-white text-red-600 border-red-200 hover:bg-red-50 flex items-center`}>
                <Trash2 className="h-3 w-3 mr-1" />Delete
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-6 sm:py-8">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="animate-slide-left min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">Manage Nucura platform</p>
          </div>
          <div className="animate-slide-right flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center px-3 py-1.5 bg-white/20 text-white rounded-lg text-sm">
              <Shield className="h-4 w-4 mr-1.5" />Administrator
            </div>
            <button onClick={handleLogout}
              className="flex items-center px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 text-sm transition">
              <LogOut className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 -mt-12 sm:-mt-14 relative z-10">
          {statCards.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} variant="scale">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-blue-900/5 p-4 sm:p-5 card-lift">
                <div className={`inline-flex items-center justify-center w-9 h-9 ${s.color} rounded-xl mb-3`}>{s.icon}</div>
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">{s.node}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {notice && <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm animate-scale-in">{notice}</div>}
        {loadError && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{loadError}</div>}

        <MobileTabs items={navItems} active={activeTab} onChange={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block lg:col-span-1 animate-slide-left">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center space-x-3 mb-5 pb-5 border-b border-slate-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{admin?.name || 'Admin'}</h3>
                  <p className="text-slate-400 text-xs">Administrator</p>
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
                        activeTab === item.key ? 'bg-white text-blue-600' : 'bg-amber-100 text-amber-700'
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
            {activeTab === 'verification' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-900">Doctor Verification Queue</h2>
                  <p className="text-xs text-slate-400 mt-1">Check each PMDC number on the PMDC website before approving. Only approved doctors appear in search and can take bookings.</p>
                </div>
                {loading ? (
                  <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl skeleton" />)}</div>
                ) : pendingDoctors.length === 0 ? (
                  <div className="p-10 text-center">
                    <ShieldCheck className="h-10 w-10 mx-auto mb-3 text-teal-300 animate-floaty" />
                    <p className="text-slate-500 text-sm">No doctors are waiting for review.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {pendingDoctors.map(d => <DoctorRow key={d.id} doctor={d} showReview />)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'doctors' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="font-semibold text-slate-900">All Doctors ({shownDoctors.length})</h2>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'approved', 'rejected', 'suspended'].map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition ${
                          statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}>{s}</button>
                    ))}
                  </div>
                </div>
                {shownDoctors.length === 0 ? (
                  <p className="p-10 text-center text-slate-400 text-sm">No doctors in this status.</p>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {shownDoctors.map(d => <DoctorRow key={d.id} doctor={d} />)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">All Appointments</h2>
                  <span className="text-xs text-slate-400">{appointments.length} total</span>
                </div>
                {loading ? (
                  <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-xl skeleton" />)}</div>
                ) : appointments.length === 0 ? (
                  <div className="p-10 text-center">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-400 text-sm">No appointments yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="md:hidden divide-y divide-slate-50">
                      {appointments.map((apt) => (
                        <div key={apt.id} className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 text-sm break-words">{apt.patient_name}</p>
                              <p className="text-xs text-slate-400 break-all">{apt.patient_email}</p>
                            </div>
                            <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${apptColor(apt.status)}`}>{apt.status}</span>
                          </div>
                          <p className="text-xs text-slate-600">With <span className="font-medium">{apt.doctor_name}</span></p>
                          <p className="text-xs text-slate-500">{apt.date} • {apt.time} • Rs. {apt.fee}</p>
                          <ApptActions apt={apt} />
                        </div>
                      ))}
                    </div>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            {['Patient', 'Doctor', 'Date & Time', 'Fee', 'Status', 'Actions'].map(h => (
                              <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {appointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-5 py-4">
                                <div className="font-medium text-slate-900 text-sm">{apt.patient_name}</div>
                                <div className="text-xs text-slate-400">{apt.patient_email}</div>
                              </td>
                              <td className="px-5 py-4 text-slate-600 text-sm">{apt.doctor_name}</td>
                              <td className="px-5 py-4">
                                <div className="text-slate-800 text-sm">{apt.date}</div>
                                <div className="text-slate-400 text-xs">{apt.time}</div>
                              </td>
                              <td className="px-5 py-4 text-slate-600 text-sm">Rs. {apt.fee}</td>
                              <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${apptColor(apt.status)}`}>{apt.status}</span></td>
                              <td className="px-5 py-4"><ApptActions apt={apt} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reason modal */}
      {reasonModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-end sm:items-center justify-center sm:p-4 z-[60]">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-5 animate-fade-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 capitalize">{reasonModal.status} {reasonModal.doctor.name}</h3>
              <button onClick={() => setReasonModal(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-slate-500 mb-3">The doctor will see this reason in their dashboard.</p>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. PMDC number could not be verified"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setReasonModal(null)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={confirmReason} disabled={!reason.trim()}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 capitalize">
                {reasonModal.status}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard