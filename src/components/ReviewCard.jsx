import { Star, Calendar } from 'lucide-react'

const ReviewCard = ({ review }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-blue-700 font-bold text-sm">
              {review.patient_name?.charAt(0)?.toUpperCase() || 'P'}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">{review.patient_name || 'Anonymous'}</h4>
            <div className="flex items-center text-slate-400 text-xs mt-0.5">
              <Calendar className="h-3 w-3 mr-1" />{formatDate(review.created_at)}
            </div>
          </div>
        </div>
        <div className="flex items-center bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
          <Star className="h-3 w-3 text-amber-500 fill-current mr-1" />
          <span className="font-semibold text-amber-600 text-xs">{review.rating}</span>
        </div>
      </div>

      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
        ))}
      </div>

      <p className="text-slate-600 text-sm leading-relaxed mb-3">{review.comment}</p>

      {review.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-lg border border-teal-100">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewCard