import { Star, MapPin, Clock, Calendar, Phone, Heart, Brain, Baby, Shield, Bone, User, Ear, Eye, Pill, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'

const DoctorCard = ({ doctor }) => {
  const getSpecializationIcon = () => {
    switch (doctor.specialization) {
      case 'Cardiologist': return <Heart className="h-6 w-6" />
      case 'Neurologist': return <Brain className="h-6 w-6" />
      case 'Pediatrician': return <Baby className="h-6 w-6" />
      case 'Dermatologist': return <Shield className="h-6 w-6" />
      case 'Orthopedic': return <Bone className="h-6 w-6" />
      case 'Gynecologist': return <User className="h-6 w-6" />
      case 'ENT Specialist': return <Ear className="h-6 w-6" />
      case 'Ophthalmologist': return <Eye className="h-6 w-6" />
      case 'Gastroenterologist': return <Pill className="h-6 w-6" />
      case 'Psychiatrist': return <Brain className="h-6 w-6" />
      default: return <Stethoscope className="h-6 w-6" />
    }
  }

  const formatAvailableDays = (days) => {
    if (!days || days.length === 0) return 'Not set'
    if (days.length <= 3) return days.join(', ')
    return `${days.slice(0, 2).join(', ')} +${days.length - 2} more`
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-5">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
              <div className="text-blue-600">{getSpecializationIcon()}</div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-base font-bold text-slate-900 truncate">{doctor.name}</h3>
                  {doctor.emergency && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-200 flex-shrink-0">
                      24/7
                    </span>
                  )}
                </div>
                <p className="text-blue-600 font-medium text-sm mb-1">{doctor.specialization}</p>
                <p className="text-slate-400 text-xs mb-3">{doctor.qualification}</p>

                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      <span className="text-xs font-semibold">{doctor.rating}</span>
                    </div>
                    <span className="text-slate-400 text-xs">({doctor.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-xs">
                    <Clock className="h-3 w-3 mr-1" />{doctor.experience} yrs exp
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <div className="flex items-start text-slate-500 text-xs">
                    <MapPin className="h-3 w-3 mr-1.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700 text-xs">{doctor.hospital}</p>
                      <p>{doctor.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-slate-500 text-xs">
                    <Calendar className="h-3 w-3 mr-1.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700 text-xs">Available</p>
                      <p>{formatAvailableDays(doctor.available_days)}</p>
                    </div>
                  </div>
                </div>

                {doctor.description && (
                  <p className="text-slate-500 text-xs mb-3 line-clamp-2">{doctor.description}</p>
                )}

                {/* Services */}
                {doctor.services?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {doctor.services.slice(0, 3).map((service, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-200">
                        {service}
                      </span>
                    ))}
                    {doctor.services.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-xs rounded-lg border border-slate-200">
                        +{doctor.services.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Fee + Actions */}
              <div className="lg:text-right lg:ml-4 flex-shrink-0">
                <div className="text-xl font-bold text-slate-900">Rs. {doctor.fee}</div>
                <p className="text-slate-400 text-xs mb-4">Consultation fee</p>

                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                  <Link to={`/doctor/${doctor.id}`}
                    className="px-4 py-2 border border-blue-200 text-blue-600 rounded-xl text-xs font-medium hover:bg-blue-50 transition-colors text-center">
                    View Profile
                  </Link>
                  <Link to={`/book-appointment/${doctor.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 transition-colors text-center">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact */}
            {doctor.contact?.phone && (
              <div className="flex items-center pt-3 border-t border-slate-50 mt-1">
                <Phone className="h-3 w-3 mr-1.5 text-teal-500" />
                <span className="text-xs text-slate-500">{doctor.contact.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorCard