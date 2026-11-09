import { Star, MapPin, Clock, Calendar, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getSpecializationIcon } from '../data/specializations'

const formatAvailableDays = (days) => {
  if (!days || days.length === 0) return 'Not set'
  if (days.length <= 3) return days.join(', ')
  return `${days.slice(0, 2).join(', ')} +${days.length - 2} more`
}

const DoctorCard = ({ doctor }) => {
  const Icon = getSpecializationIcon(doctor.specialization)

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/60 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 overflow-hidden relative">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-600 to-teal-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

      <div className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">

          {/* Left: icon + info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-teal-500 group-hover:border-transparent transition-all duration-300 group-hover:rotate-3 group-hover:scale-110">
              <Icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
                <h3 className="text-base font-bold text-slate-900 break-words">{doctor.name}</h3>
                {doctor.emergency && (
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-200 flex-shrink-0">24/7</span>
                )}
              </div>
              <p className="text-blue-600 font-medium text-sm mb-0.5">{doctor.specialization}</p>
              {doctor.qualification && <p className="text-slate-400 text-xs mb-3 break-words">{doctor.qualification}</p>}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                <div className="flex items-center gap-1">
                  <div className="flex items-center bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    <span className="text-xs font-semibold">{doctor.rating || 0}</span>
                  </div>
                  <span className="text-slate-400 text-xs">({doctor.total_reviews || 0} reviews)</span>
                </div>
                <div className="flex items-center text-slate-500 text-xs">
                  <Clock className="h-3 w-3 mr-1" />{doctor.experience || 0} yrs exp
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <div className="flex items-start text-slate-500 text-xs min-w-0">
                  <MapPin className="h-3 w-3 mr-1.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-700 break-words">{doctor.hospital || 'Hospital not set'}</p>
                    <p>{doctor.location || 'Location not set'}</p>
                  </div>
                </div>
                <div className="flex items-start text-slate-500 text-xs">
                  <Calendar className="h-3 w-3 mr-1.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Available</p>
                    <p>{formatAvailableDays(doctor.available_days)}</p>
                  </div>
                </div>
              </div>

              {doctor.description && <p className="text-slate-500 text-xs mb-3 line-clamp-2">{doctor.description}</p>}

              {doctor.services?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {doctor.services.slice(0, 3).map((service, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-200 group-hover:border-blue-200 transition-colors">{service}</span>
                  ))}
                  {doctor.services.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-xs rounded-lg border border-slate-200">+{doctor.services.length - 3}</span>
                  )}
                </div>
              )}

              {doctor.contact?.phone && (
                <div className="flex items-center mt-3 text-xs text-slate-500">
                  <Phone className="h-3 w-3 mr-1.5 text-teal-500" />{doctor.contact.phone}
                </div>
              )}
            </div>
          </div>

          {/* Right: fee + actions. Bottom bar on mobile, side column on desktop */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 lg:border-0 lg:pt-0 lg:flex-col lg:items-end lg:flex-shrink-0 lg:ml-4">
            <div className="lg:text-right">
              <div className="text-xl font-bold text-slate-900">Rs. {doctor.fee || 0}</div>
              <p className="text-slate-400 text-xs">Consultation fee</p>
            </div>
            <div className="flex gap-2 lg:flex-col lg:w-32">
              <Link to={`/doctor/${doctor.id}`}
                className="px-4 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-xs font-medium hover:bg-blue-50 transition-all text-center active:scale-95">
                View Profile
              </Link>
              <Link to={`/book-appointment/${doctor.id}`}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all text-center active:scale-95">
                Book Now
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DoctorCard