import { useState, useEffect } from 'react'
import { Search, Filter, Users, X, Phone } from 'lucide-react'
import DoctorCard from '../components/DoctorCard'
import Reveal from '../components/Reveal'
import { getAllDoctors } from '../api/doctors'

const filterDoctors = (doctors, filters) => {
  return doctors.filter(doctor => {
    if (filters.name && !doctor.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.specialization && doctor.specialization !== filters.specialization) return false
    if (filters.location) {
      const doctorCity = doctor.location?.split(',')[0].trim() || ''
      if (doctorCity.toLowerCase() !== filters.location.toLowerCase()) return false
    }
    if (filters.hospital && !(doctor.hospital || '').toLowerCase().includes(filters.hospital.toLowerCase())) return false
    if (filters.minExperience && doctor.experience < filters.minExperience) return false
    if (filters.maxFee && doctor.fee > filters.maxFee) return false
    return true
  })
}

const sortDoctors = (doctors, sortBy) => {
  const sorted = [...doctors]
  switch (sortBy) {
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating)
    case 'experience': return sorted.sort((a, b) => b.experience - a.experience)
    case 'fee_low': return sorted.sort((a, b) => a.fee - b.fee)
    case 'fee_high': return sorted.sort((a, b) => b.fee - a.fee)
    case 'name': return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default: return sorted
  }
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-5">
    <div className="w-16 h-16 rounded-2xl skeleton flex-shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="h-4 w-1/3 rounded skeleton" />
      <div className="h-3 w-1/4 rounded skeleton" />
      <div className="h-3 w-2/3 rounded skeleton" />
      <div className="h-3 w-1/2 rounded skeleton" />
    </div>
    <div className="w-24 space-y-3 hidden sm:block">
      <div className="h-5 w-full rounded skeleton" />
      <div className="h-8 w-full rounded-xl skeleton" />
    </div>
  </div>
)

const DoctorsList = () => {
  const [allDoctors, setAllDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ name: '', specialization: '', location: '', hospital: '', minExperience: '', maxFee: '' })
  const [sortBy, setSortBy] = useState('rating')
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    getAllDoctors().then(data => {
      setAllDoctors(data)
      setFilteredDoctors(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const specializations = ['All Specializations', ...new Set(allDoctors.map(d => d.specialization))]
  const cities = ['All Cities', ...new Set(allDoctors.map(d => d.location?.split(',')[0].trim()).filter(Boolean))]

  useEffect(() => {
    if (allDoctors.length === 0) return
    let result = filterDoctors(allDoctors, filters)
    result = sortDoctors(result, sortBy)
    setFilteredDoctors(result)
  }, [filters, sortBy, allDoctors])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value === 'All Specializations' || value === 'All Cities' ? '' : value }))
  }

  const clearFilters = () => setFilters({ name: '', specialization: '', location: '', hospital: '', minExperience: '', maxFee: '' })
  const hasActiveFilters = () => Object.values(filters).some(v => v !== '')

  const inputClass = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Animated header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-12">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2 animate-slide-left">Find a Doctor</h1>
          <p className="text-blue-100 animate-slide-left" style={{ animationDelay: '150ms' }}>
            Book appointments with verified healthcare professionals across Pakistan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <Reveal variant="up">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 -mt-14 relative z-10 shadow-xl shadow-blue-900/5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input type="text" placeholder="Search doctor name" className={`${inputClass} pl-9`}
                  value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} />
              </div>
              <select className={inputClass} value={filters.specialization || 'All Specializations'}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}>
                {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
              <select className={inputClass} value={filters.location || 'All Cities'}
                onChange={(e) => handleFilterChange('location', e.target.value)}>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <select className={inputClass} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experience</option>
                <option value="fee_low">Fee: Low to High</option>
                <option value="fee_high">Fee: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Advanced Filters'}
              </button>
              {hasActiveFilters() && (
                <button onClick={clearFilters} className="flex items-center text-red-500 hover:text-red-600 text-sm font-medium animate-scale-in">
                  <X className="h-4 w-4 mr-1" />Clear Filters
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-up">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Hospital/Clinic</label>
                    <input type="text" placeholder="Enter hospital name" className={inputClass}
                      value={filters.hospital} onChange={(e) => handleFilterChange('hospital', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Min Experience</label>
                    <select className={inputClass} value={filters.minExperience}
                      onChange={(e) => handleFilterChange('minExperience', e.target.value)}>
                      <option value="">Any experience</option>
                      <option value="5">5+ years</option>
                      <option value="10">10+ years</option>
                      <option value="15">15+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Max Fee</label>
                    <select className={inputClass} value={filters.maxFee}
                      onChange={(e) => handleFilterChange('maxFee', e.target.value)}>
                      <option value="">Any fee</option>
                      <option value="1000">Under Rs. 1,000</option>
                      <option value="2000">Under Rs. 2,000</option>
                      <option value="3000">Under Rs. 3,000</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Active Filters */}
        {hasActiveFilters() && (
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null
              let display = value
              if (key === 'minExperience') display = `${value}+ years exp`
              if (key === 'maxFee') display = `Under Rs. ${value}`
              return (
                <span key={key} className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs flex items-center animate-scale-in">
                  {display}
                  <button onClick={() => handleFilterChange(key, '')} className="ml-2 text-blue-400 hover:text-blue-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}

        {/* Results Info */}
        <Reveal variant="fade">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600 text-sm">
              <span className="font-semibold text-blue-700">{loading ? '...' : filteredDoctors.length}</span> doctors found
              {hasActiveFilters() && ' matching your filters'}
            </p>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:flex items-center text-slate-500 text-sm">
                <Users className="h-4 w-4 mr-1.5" />{allDoctors.length} total doctors
              </span>
              <a href="tel:1122" className="flex items-center text-red-600 text-sm font-medium">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <Phone className="h-4 w-4 mr-1.5" />Emergency: 1122
              </a>
            </div>
          </div>
        </Reveal>

        {/* Doctors List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 animate-scale-in">
            <Users className="h-10 w-10 mx-auto mb-3 text-slate-200 animate-floaty" />
            <h3 className="font-semibold text-slate-700 mb-1">No doctors found</h3>
            <p className="text-slate-400 text-sm mb-4">Try adjusting your search filters</p>
            <button onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition active:scale-95">
              View All Doctors
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors.map((doctor, i) => (
              <Reveal key={doctor.id} delay={Math.min(i, 5) * 80}>
                <DoctorCard doctor={doctor} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <Reveal>
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '12+', label: 'Medical Specialties' },
                { value: '5+', label: 'Cities in Pakistan' },
                { value: '24/7', label: 'Support Available' },
                { value: '4.8', label: 'Average Rating' }
              ].map((stat, i) => (
                <div key={i} className="text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-2xl font-bold text-blue-700 mb-1">{stat.value}</div>
                  <p className="text-slate-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

export default DoctorsList