import { useState, useEffect } from 'react'
import { Users, Stethoscope, Calendar, DollarSign, LogOut, Shield, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAllDoctors, deleteDoctor } from '../api/doctors'
import { getAllAppointments, updateAppointmentStatus } from '../api/appointments'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('doctors')
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getAllDoctors().then(data => setDoctors(data || []))
    getAllAppointments().then(result => { if (result.success) setAppointments(result.data); setLoading(false) })
  }, [])

  const handleLogout = async () => { await logout(); navigate('/login') }

  const handleStatusChange = async (id, status) => {
    const result = await updateAppointmentStatus(id, status)
    if (result.success) setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Remove this doctor?')) return
    const result = await deleteDoctor(id)
    if (result.success) setDoctors(prev => prev.filter(d => d.id !== id))
    else alert('Failed: ' + result.error)
  }

  const stats = {
    totalDoctors: doctors.length,
    totalAppointments: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    totalRevenue: appointments.filter(a => a.status === 'confirmed').reduce((sum, a) => sum + (a.fee || 0), 0)
  }

  const statusColor = (status) => {
    if (status === 'confirmed') return 'bg-teal-50 text-teal-700 border border-teal-200'
    if (status === 'pending') return 'bg-amber-50 text-amber-700 border border-amber-200'
    if (status === 'cancelled') return 'bg-red-50 text-red-600 border border-red-200'
    return 'bg-slate-100 text-slate-600'
  }

  const statCards = [
    { label: 'Total Doctors', node: <CountUp value={stats.totalDoctors} />, icon: <Stethoscope className="h-5 w-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Appointments', node: <CountUp value={stats.totalAppointments} />, icon: <Calendar className="h-5 w-5" />, color: 'bg-teal-50 text-teal-600' },
    { label: 'Pending', node: <CountUp value={stats.pending} />, icon: <Users className="h-5 w-5" />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Revenue', node: <CountUp value={stats.totalRevenue} prefix="Rs. " />, icon: <DollarSign className="h-5 w-5" />, color: 'bg-indigo-50 text-indigo-600' }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-8">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="animate-slide-left">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">Manage Nucura platform</p>
          </div>
          <div className="animate-slide-right flex items-center space-x-3">
            <div className="flex items-center px-3 py-1.5 bg-white/20 text-white rounded-lg text-sm">
              <Shield className="h-4 w-4 mr-1.5" />Administrator
            </div>
            <button onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 text-sm transition">
              <LogOut className="h-4 w-4 mr-2" />Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-14 relative z-10">
          {statCards.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} variant="scale">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-blue-900/5 p-5 card-lift">
                <div className={`inline-flex items-center justify-center w-9 h-9 ${s.color} rounded-xl mb-3`}>{s.icon}</div>
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-slate-900">{s.node}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 animate-slide-left">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center space-x-3 mb-5 pb-5 border-b border-slate-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Admin</h3>
                  <p className="text-slate-400 text-xs">Administrator</p>
                </div>
              </div>
              <nav className="space-y-1">
                {[
                  { key: 'doctors', label: 'Manage Doctors', icon: <Stethoscope className="h-4 w-4 mr-3" /> },
                  { key: 'appointments', label: 'All Appointments', icon: <Calendar className="h-4 w-4 mr-3" /> },
                ].map(item => (
                  <button key={item.key} onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === item.key ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                    }`}>
                    {item.icon}{item.label}
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
            {activeTab === 'doctors' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Doctors</h2>
                  <span className="text-xs text-slate-400">{doctors.length} total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Doctor', 'Specialization', 'Experience', 'Fee', 'Action'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {doctors.map((doctor, i) => (
                        <tr key={doctor.id} style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                          className="animate-fade-up hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-medium text-slate-900 text-sm">{doctor.name}</div>
                            <div className="text-xs text-slate-400">{doctor.hospital}</div>
                          </td>
                          <td className="px-5 py-4"><span className="text-blue-600 font-medium text-sm">{doctor.specialization}</span></td>
                          <td className="px-5 py-4 text-slate-600 text-sm">{doctor.experience} yrs</td>
                          <td className="px-5 py-4 text-slate-600 text-sm">Rs. {doctor.fee}</td>
                          <td className="px-5 py-4">
                            <button onClick={() => handleDeleteDoctor(doctor.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 flex items-center active:scale-95 transition">
                              <Trash2 className="h-3 w-3 mr-1" />Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">All Appointments</h2>
                  <span className="text-xs text-slate-400">{appointments.length} total</span>
                </div>
                {loading ? (
                  <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-xl skeleton" />)}</div>
                ) : appointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
                    <p className="text-slate-400 text-sm">No appointments yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          {['Patient', 'Doctor', 'Date & Time', 'Fee', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {appointments.map((apt, i) => (
                          <tr key={apt.id} style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                            className="animate-fade-up hover:bg-slate-50 transition-colors">
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
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${statusColor(apt.status)}`}>{apt.status}</span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex space-x-2">
                                {apt.status === 'pending' && (
                                  <button onClick={() => handleStatusChange(apt.id, 'confirmed')}
                                    className="px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-xs font-medium hover:bg-teal-100 active:scale-95 transition">Confirm</button>
                                )}
                                {apt.status !== 'cancelled' && (
                                  <button onClick={() => handleStatusChange(apt.id, 'cancelled')}
                                    className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 active:scale-95 transition">Cancel</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard