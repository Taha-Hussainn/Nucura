import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, User, Mail, Phone, AlertCircle, Check, ArrowRight } from 'lucide-react'
import { getDoctorById } from '../api/doctors'
import { createAppointment, getBookedSlots } from '../api/appointments'
import { getCurrentUser } from '../api/auth'
import { getOrCreateChat } from '../api/chat'

const weekdayOf = (dateStr) =>
  dateStr ? new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' }) : ''

const BookAppointment = () => {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])
  const [formData, setFormData] = useState({
    patientName: '', patientEmail: '', patientPhone: '',
    date: '', timeSlot: '', symptoms: '', notes: ''
  })

  useEffect(() => {
    getDoctorById(doctorId).then(data => { setDoctor(data); setLoading(false) })
    getCurrentUser().then(user => {
      if (user) {
        setCurrentUser(user)
        setFormData(prev => ({ ...prev, patientName: user.name || '', patientEmail: user.email || '', patientPhone: user.phone || '' }))
      }
    })
  }, [doctorId])

  // Whenever the date changes, find out which slots are already taken
  useEffect(() => {
    if (!doctor || !formData.date) { setBookedSlots([]); return }
    let cancelled = false
    getBookedSlots(doctor.id, formData.date).then(slots => {
      if (cancelled) return
      setBookedSlots(slots)
      setFormData(prev => (slots.includes(prev.timeSlot) ? { ...prev, timeSlot: '' } : prev))
    })
    return () => { cancelled = true }
  }, [doctor, formData.date])

  const dayName = weekdayOf(formData.date)
  const workingDays = doctor?.available_days || []
  const dayAvailable = !formData.date || workingDays.length === 0 || workingDays.includes(dayName)

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)
    const result = await createAppointment({
      patientId: currentUser.id, patientName: formData.patientName,
      patientEmail: formData.patientEmail, patientPhone: formData.patientPhone,
      doctorId: doctor.id, doctorName: doctor.name, date: formData.date,
      time: formData.timeSlot, symptoms: formData.symptoms, notes: formData.notes, fee: doctor.fee
    })
    if (result.success) {
      await getOrCreateChat(currentUser.id, doctor.id, currentUser.name, doctor.name)
      setStep(4)
    } else {
      setError(result.error)
      // Slot probably got taken: refresh and send the patient back to pick another one
      if (/slot/i.test(result.error)) {
        setBookedSlots(await getBookedSlots(doctor.id, formData.date))
        setFormData(prev => ({ ...prev, timeSlot: '' }))
        setStep(2)
      }
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-28 skeleton" />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="h-24 rounded-2xl skeleton" />
        <div className="h-72 rounded-2xl skeleton" />
      </div>
    </div>
  )

  if (!doctor || doctor.verification_status !== 'approved') return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-scale-in">
      <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {doctor ? 'This doctor is not accepting bookings' : 'Doctor Not Found'}
      </h1>
      <Link to="/doctors" className="inline-block mt-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">Find Another Doctor</Link>
    </div>
  )

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-8">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white mb-1 animate-slide-left">Book Appointment</h1>
          <p className="text-blue-100 text-sm animate-slide-left" style={{ animationDelay: '120ms' }}>Complete the steps below to confirm your booking</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-blue-900/5 p-5 mb-6 -mt-12 relative z-10 animate-fade-up">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 min-w-[160px]">
              <h2 className="font-bold text-slate-900">{doctor.name}</h2>
              <p className="text-blue-600 text-sm">{doctor.specialization}</p>
              <p className="text-slate-400 text-xs">{doctor.hospital}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-slate-900">Rs. {doctor.fee}</p>
              <p className="text-slate-400 text-xs">Consultation fee</p>
            </div>
          </div>
        </div>

        {step < 4 && (
          <div className="flex items-center justify-center mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 ${
                  step > s ? 'bg-teal-500 text-white' : step === s ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div className="w-10 sm:w-20 h-0.5 mx-1 bg-slate-200 overflow-hidden rounded">
                    <div className="h-full bg-teal-400 transition-all duration-700 ease-out" style={{ width: step > s ? '100%' : '0%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {error && step < 4 && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-scale-in">{error}</div>
        )}

        <div key={step} className="animate-fade-up">
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
              <h2 className="font-bold text-slate-900 mb-5">Patient Information</h2>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input type="text" placeholder="Full Name" required className={`${inputClass} pl-10`}
                    value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input type="email" placeholder="Email Address" required className={`${inputClass} pl-10`}
                    value={formData.patientEmail} onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })} />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input type="tel" placeholder="Phone Number" required className={`${inputClass} pl-10`}
                    value={formData.patientPhone} onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })} />
                </div>
                <textarea placeholder="Describe your symptoms (optional)..." className={`${inputClass} h-28 resize-none`}
                  value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} />
              </div>
              <button onClick={() => setStep(2)}
                disabled={!formData.patientName || !formData.patientEmail || !formData.patientPhone}
                className="group mt-5 w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center active:scale-[0.98]">
                Next: Select Date & Time <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
              <h2 className="font-bold text-slate-900 mb-5">Select Date & Time</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Appointment Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input type="date" min={new Date().toISOString().split('T')[0]} className={`${inputClass} pl-10`}
                      value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value, timeSlot: '' })} />
                  </div>
                  {!dayAvailable && (
                    <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      {doctor.name} does not see patients on {dayName}s. Available days: {workingDays.join(', ')}.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Available Time Slots</label>
                  {!formData.date ? (
                    <p className="text-slate-400 text-sm">Pick a date to see available slots.</p>
                  ) : doctor.slots?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {doctor.slots.map((slot, i) => {
                        const taken = bookedSlots.includes(slot)
                        return (
                          <button key={slot} disabled={taken || !dayAvailable}
                            onClick={() => setFormData({ ...formData, timeSlot: slot })}
                            style={{ animationDelay: `${i * 50}ms` }}
                            className={`animate-scale-in py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                              taken || !dayAvailable
                                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                                : formData.timeSlot === slot
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                  : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-0.5 active:scale-95'
                            }`}>
                            <Clock className="h-3 w-3 inline mr-1" />{slot}{taken ? ' (booked)' : ''}
                          </button>
                        )
                      })}
                    </div>
                  ) : <p className="text-slate-400 text-sm">This doctor has not added time slots yet.</p>}
                </div>
              </div>
              <div className="flex space-x-3 mt-5">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition">Back</button>
                <button onClick={() => setStep(3)} disabled={!formData.date || !formData.timeSlot || !dayAvailable}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 active:scale-[0.98]">
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
              <h2 className="font-bold text-slate-900 mb-5">Review & Confirm</h2>
              <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                <h3 className="font-medium text-slate-700 text-sm mb-3">Appointment Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Doctor', doctor.name], ['Specialty', doctor.specialization],
                    ['Date', formData.date], ['Time', formData.timeSlot],
                    ['Patient', formData.patientName], ['Fee', `Rs. ${doctor.fee}`]
                  ].map(([label, value], i) => (
                    <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                      <span className="text-slate-400 text-xs">{label}</span>
                      <p className="font-medium text-slate-800 text-xs break-words">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              {formData.symptoms && (
                <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
                  <p className="text-xs font-medium text-blue-600 mb-1">Symptoms</p>
                  <p className="text-slate-700 text-sm break-words">{formData.symptoms}</p>
                </div>
              )}
              <p className="text-xs text-slate-400 mb-1">The doctor will confirm your request. Payment is made directly to the doctor.</p>
              <div className="flex space-x-3 mt-4">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition">Back</button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition disabled:opacity-50 active:scale-[0.98]">
                  {submitting ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <span className="absolute inset-0 rounded-full bg-teal-200 animate-ping opacity-60" />
                <div className="relative w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center animate-scale-in">
                  <Check className="h-8 w-8 text-teal-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 animate-fade-up" style={{ animationDelay: '200ms' }}>Request Sent!</h2>
              <p className="text-slate-500 text-sm mb-1 animate-fade-up" style={{ animationDelay: '300ms' }}>Your appointment request with <strong>{doctor.name}</strong> is waiting for confirmation.</p>
              <p className="text-slate-400 text-xs mb-6 animate-fade-up" style={{ animationDelay: '400ms' }}>{formData.date} at {formData.timeSlot}. A chat has been created in your dashboard.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up" style={{ animationDelay: '500ms' }}>
                <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition active:scale-95">View Dashboard</Link>
                <Link to="/doctors" className="border border-slate-200 px-6 py-3 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition active:scale-95">Find More Doctors</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookAppointment