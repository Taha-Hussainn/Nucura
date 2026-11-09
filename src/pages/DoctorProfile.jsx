import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Clock, Calendar, Award, Briefcase, Phone, Mail, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import ReviewCard from '../components/ReviewCard'
import AddReviewModal from '../components/AddReviewModal'
import Reveal from '../components/Reveal'
import { getDoctorById } from '../api/doctors'
import { getReviewsByDoctor } from '../api/reviews'
import { getCurrentUser } from '../api/auth'
import { getSpecializationIcon } from '../data/specializations'

const DoctorProfile = () => {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [reviews, setReviews] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [barsReady, setBarsReady] = useState(false)

  useEffect(() => {
    getDoctorById(id).then(data => { setDoctor(data); setLoading(false) })
    getReviewsByDoctor(id).then(result => { if (result.success) setReviews(result.data) })
    getCurrentUser().then(user => setCurrentUser(user))
  }, [id])

  useEffect(() => {
    if (activeTab !== 'reviews') return
    setBarsReady(false)
    const t = setTimeout(() => setBarsReady(true), 150)
    return () => clearTimeout(t)
  }, [activeTab, reviews.length])

  const handleReviewAdded = (newReview) => setReviews(prev => [newReview, ...prev])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : doctor?.rating || 0

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-40 skeleton" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-xl skeleton" />)}
        </div>
        <div className="h-64 rounded-2xl skeleton" />
      </div>
    </div>
  )

  if (!doctor) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-scale-in">
      <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Doctor Not Found</h1>
      <Link to="/doctors" className="inline-block mt-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
        Browse Doctors
      </Link>
    </div>
  )

  const Icon = getSpecializationIcon(doctor.specialization)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-6 sm:py-8">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pop-float">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div className="min-w-0 animate-slide-left" style={{ animationDelay: '100ms' }}>
                <h1 className="text-xl sm:text-2xl font-bold text-white break-words">{doctor.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="text-teal-100 font-medium text-sm">{doctor.specialization}</span>
                  <span className="text-blue-100 text-sm flex items-center">
                    <Briefcase className="h-3 w-3 mr-1" />{doctor.experience || 0} years exp
                  </span>
                </div>
                {doctor.qualification && <p className="text-blue-100 text-sm mt-1 break-words">{doctor.qualification}</p>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center bg-white/20 px-3 py-1.5 rounded-xl">
                <Star className="h-4 w-4 text-yellow-300 fill-current mr-1" />
                <span className="font-bold text-white">{avgRating}</span>
                <span className="text-blue-100 text-sm ml-1">({reviews.length})</span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">Rs. {doctor.fee || 0}</div>
                <p className="text-blue-100 text-xs">Consultation fee</p>
              </div>
              <Link to={`/book-appointment/${doctor.id}`}
                className="w-full sm:w-auto text-center bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 active:scale-95 transition-all shadow-lg">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { icon: <MapPin className="h-4 w-4" />, label: 'Location', value: doctor.location || 'Not set' },
            { icon: <Clock className="h-4 w-4" />, label: 'Available', value: doctor.available_time || 'Not set' },
            { icon: <Phone className="h-4 w-4" />, label: 'Phone', value: doctor.contact?.phone || 'Not listed' },
            { icon: <Mail className="h-4 w-4" />, label: 'Email', value: doctor.contact?.email || 'Not listed' }
          ].map((item, i) => (
            <Reveal key={i} delay={i * 100} variant="scale">
              <div className="bg-white rounded-xl border border-slate-100 p-3 sm:p-4 hover:-translate-y-1 hover:shadow-md hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center space-x-2 text-blue-600 mb-1">
                  {item.icon}
                  <span className="text-xs font-medium text-slate-500">{item.label}</span>
                </div>
                <p className="text-slate-800 text-sm font-medium truncate">{item.value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Tabs */}
        <Reveal>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-100 px-2">
              <nav className="flex space-x-1 overflow-x-auto no-scrollbar">
                {['overview', 'availability', 'reviews', 'services'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`relative py-4 px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    {tab === 'reviews' ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 origin-left transition-transform duration-300 ${
                      activeTab === tab ? 'scale-x-100' : 'scale-x-0'
                    }`} />
                  </button>
                ))}
              </nav>
            </div>

            <div key={activeTab} className="p-4 sm:p-6 animate-fade-up">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 break-words">About {doctor.name}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{doctor.description || 'No description added yet.'}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctor.education?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-3 flex items-center text-sm"><Award className="h-4 w-4 mr-2 text-blue-600" />Education</h3>
                        <ul className="space-y-2">
                          {doctor.education.map((edu, idx) => (
                            <li key={idx} className="flex items-start text-sm text-slate-600 animate-slide-left" style={{ animationDelay: `${idx * 100}ms` }}>
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>{edu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {doctor.awards?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-3 flex items-center text-sm"><Award className="h-4 w-4 mr-2 text-teal-600" />Awards</h3>
                        <ul className="space-y-2">
                          {doctor.awards.map((award, idx) => (
                            <li key={idx} className="flex items-start text-sm text-slate-600 animate-slide-left" style={{ animationDelay: `${idx * 100}ms` }}>
                              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>{award}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'availability' && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Availability</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-slate-700 mb-3 flex items-center text-sm"><Calendar className="h-4 w-4 mr-2 text-blue-600" />Available Days</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                          <div key={day} style={{ animationDelay: `${i * 60}ms` }}
                            className={`animate-scale-in p-3 rounded-xl border text-xs ${
                              doctor.available_days?.includes(day) ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-slate-50 border-slate-100 text-slate-400'
                            }`}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{day}</span>
                              {doctor.available_days?.includes(day) && <CheckCircle className="h-3 w-3" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-700 mb-3 text-sm">Clinic Information</h3>
                      <div className="space-y-3">
                        {doctor.hospital && (
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h4 className="font-medium text-slate-800 text-sm mb-1">{doctor.hospital}</h4>
                            <p className="text-slate-500 text-xs flex items-center"><MapPin className="h-3 w-3 mr-1" />{doctor.location}</p>
                          </div>
                        )}
                        {doctor.clinic && (
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h4 className="font-medium text-slate-800 text-sm mb-1">{doctor.clinic}</h4>
                            <p className="text-slate-500 text-xs">Private Clinic</p>
                          </div>
                        )}
                        {!doctor.hospital && !doctor.clinic && <p className="text-slate-400 text-sm">Clinic details not added yet.</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Patient Reviews</h2>
                      <p className="text-slate-500 text-sm">{reviews.length} reviews</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900">{avgRating}</div>
                        <div className="flex items-center justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} style={{ animationDelay: `${i * 100}ms` }}
                              className={`animate-scale-in h-4 w-4 ${i < Math.floor(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      {currentUser?.userType === 'patient' ? (
                        <button onClick={() => setShowReviewModal(true)}
                          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition active:scale-95">
                          Write Review
                        </button>
                      ) : !currentUser && (
                        <Link to="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                          Login to Review
                        </Link>
                      )}
                    </div>
                  </div>

                  {reviews.length > 0 && (
                    <div className="space-y-2 mb-6">
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = reviews.filter(r => r.rating === star).length
                        const percent = (count / reviews.length) * 100
                        return (
                          <div key={star} className="flex items-center space-x-3">
                            <span className="text-xs text-slate-500 w-3">{star}</span>
                            <Star className="h-3 w-3 text-amber-400 fill-current" />
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: barsReady ? `${percent}%` : '0%' }}></div>
                            </div>
                            <span className="text-xs text-slate-400 w-4">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="h-8 w-8 mx-auto mb-2 text-slate-200 animate-floaty" />
                      <p className="text-slate-500 text-sm">No reviews yet. Be the first!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((review, i) => (
                        <div key={review.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 5) * 100}ms` }}>
                          <ReviewCard review={review} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Services</h2>
                  {doctor.services?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {doctor.services.map((service, idx) => (
                        <div key={idx} style={{ animationDelay: `${idx * 80}ms` }}
                          className="animate-scale-in p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start space-x-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-slate-800 text-sm">{service}</h3>
                            <p className="text-slate-500 text-xs mt-0.5">Available for consultation</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-slate-500 text-sm">No services listed yet.</p>}

                  {doctor.insurance?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium text-slate-700 mb-3 text-sm">Insurance Accepted</h3>
                      <div className="flex flex-wrap gap-2">
                        {doctor.insurance.map((insurer, i) => (
                          <span key={insurer} style={{ animationDelay: `${i * 80}ms` }}
                            className="animate-scale-in px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs flex items-center text-slate-600">
                            <Shield className="h-3 w-3 mr-1.5 text-teal-500" />{insurer}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {showReviewModal && (
        <AddReviewModal doctor={doctor} currentUser={currentUser}
          onClose={() => setShowReviewModal(false)} onReviewAdded={handleReviewAdded} />
      )}
    </div>
  )
}

export default DoctorProfile