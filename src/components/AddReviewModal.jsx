import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { addReview, checkExistingReview } from '../api/reviews'

const TAGS = ['Knowledgeable', 'Professional', 'Caring', 'Punctual', 'Thorough', 'Patient', 'Effective', 'Friendly']

const AddReviewModal = ({ doctor, currentUser, onClose, onReviewAdded }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const toggleTag = (tag) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating'); return }
    if (!comment.trim()) { setError('Please write a comment'); return }
    if (!currentUser) { setError('Please login to submit a review'); return }

    setSubmitting(true)
    setError('')

    const alreadyReviewed = await checkExistingReview(doctor.id, currentUser.id)
    if (alreadyReviewed) {
      setError('You have already reviewed this doctor.')
      setSubmitting(false)
      return
    }

    const result = await addReview({
      doctorId: doctor.id,
      patientId: currentUser.id,
      patientName: currentUser.name,
      rating,
      comment,
      tags: selectedTags
    })

    if (result.success) {
      onReviewAdded(result.data)
      onClose()
    } else {
      setError(result.error)
    }
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Write a Review</h2>
            <p className="text-slate-500 text-xs mt-0.5">Share your experience with {doctor.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-700 font-bold text-xs">Dr</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{doctor.name}</p>
              <p className="text-blue-600 text-xs">{doctor.specialization}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Your Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110">
                  <Star className={`h-9 w-9 ${star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-slate-600 text-sm font-medium">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Your Experience</label>
            <textarea
              placeholder="Describe your experience with this doctor..."
              maxLength={500}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none h-28 resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <p className="text-slate-400 text-xs mt-1">{comment.length}/500</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Tags (optional)</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div className="flex space-x-3">
            <button onClick={onClose}
              className="flex-1 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm text-slate-600 font-medium transition">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold transition disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddReviewModal