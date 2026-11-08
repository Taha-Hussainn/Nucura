import { useState } from 'react'
import { X, Plus, Trash2, FileText } from 'lucide-react'
import { createPrescription } from '../api/prescriptions'

const PrescriptionModal = ({ appointment, currentUser, onClose, onCreated }) => {
  const [diagnosis, setDiagnosis] = useState('')
  const [instructions, setInstructions] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }])

  const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"

  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }])
  const removeMedicine = (idx) => setMedicines(medicines.filter((_, i) => i !== idx))
  const updateMedicine = (idx, field, value) =>
    setMedicines(medicines.map((m, i) => i === idx ? { ...m, [field]: value } : m))

  const handleSubmit = async () => {
    if (!diagnosis.trim()) { alert('Please enter a diagnosis'); return }
    const validMedicines = medicines.filter(m => m.name.trim())
    if (validMedicines.length === 0) { alert('Please add at least one medicine'); return }

    setSubmitting(true)
    const result = await createPrescription({
      appointmentId: appointment.id,
      patientId: appointment.patient_id,
      doctorId: currentUser.id,
      patientName: appointment.patient_name,
      doctorName: currentUser.name,
      diagnosis,
      medicines: validMedicines,
      instructions,
      followUpDate
    })

    if (result.success) {
      onCreated(result.data)
      onClose()
    } else {
      alert('Failed to create prescription: ' + result.error)
    }
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-700 to-teal-700 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Write Prescription</h2>
              <p className="text-blue-100 text-xs">Patient: {appointment.patient_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-1.5 rounded-lg transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Diagnosis *</label>
            <textarea placeholder="Enter diagnosis..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none"
              value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-600">Medicines *</label>
              <button onClick={addMedicine} className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium">
                <Plus className="h-3 w-3 mr-1" />Add Medicine
              </button>
            </div>
            <div className="space-y-3">
              {medicines.map((med, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Medicine Name</label>
                      <input type="text" placeholder="e.g. Paracetamol" className={inputClass}
                        value={med.name} onChange={(e) => updateMedicine(idx, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Dosage</label>
                      <input type="text" placeholder="e.g. 500mg" className={inputClass}
                        value={med.dosage} onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Frequency</label>
                      <select className={inputClass} value={med.frequency}
                        onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)}>
                        <option value="">Select frequency</option>
                        <option>Once daily</option>
                        <option>Twice daily</option>
                        <option>Three times daily</option>
                        <option>Four times daily</option>
                        <option>As needed</option>
                        <option>Before meals</option>
                        <option>After meals</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Duration</label>
                      <input type="text" placeholder="e.g. 7 days" className={inputClass}
                        value={med.duration} onChange={(e) => updateMedicine(idx, 'duration', e.target.value)} />
                    </div>
                  </div>
                  {medicines.length > 1 && (
                    <button onClick={() => removeMedicine(idx)} className="flex items-center text-red-500 hover:text-red-700 text-xs">
                      <Trash2 className="h-3 w-3 mr-1" />Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Special Instructions</label>
            <textarea placeholder="Any special instructions for the patient..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
              value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Follow-up Date (optional)</label>
            <input type="date" min={new Date().toISOString().split('T')[0]}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
          </div>

          <div className="flex space-x-3">
            <button onClick={onClose}
              className="flex-1 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm text-slate-600 font-medium">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionModal