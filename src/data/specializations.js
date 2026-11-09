import { Heart, Brain, Baby, Bone, Eye, Ear, Pill, Shield, User, Stethoscope, Activity, Smile, Syringe, Microscope, Droplets, Wind, Scissors, Leaf } from 'lucide-react'

export const specializations = [
  'Allergist', 'Anesthesiologist', 'Audiologist', 'Bariatric Surgeon', 'Cardiologist',
  'Cardiothoracic Surgeon', 'Child Psychiatrist', 'Chiropractor', 'Colorectal Surgeon',
  'Cosmetic Surgeon', 'Critical Care Specialist', 'Dentist', 'Dermatologist', 'Diabetologist',
  'Emergency Medicine Specialist', 'Endocrinologist', 'Endodontist', 'ENT Specialist',
  'Family Physician', 'Fertility Specialist', 'Gastroenterologist', 'General Physician',
  'General Surgeon', 'Geneticist', 'Geriatrician', 'Gynecologist', 'Hair Transplant Specialist',
  'Hakeem (Unani Medicine)', 'Hand Surgeon', 'Hematologist', 'Hepatologist', 'Homeopath',
  'Infectious Disease Specialist', 'Internal Medicine Specialist', 'Laparoscopic Surgeon',
  'Nephrologist', 'Neonatologist', 'Neurologist', 'Neurosurgeon', 'Nuclear Medicine Specialist',
  'Nutritionist', 'Obstetrician', 'Occupational Therapist', 'Oncologist', 'Ophthalmologist',
  'Oral & Maxillofacial Surgeon', 'Orthodontist', 'Orthopedic', 'Pain Management Specialist',
  'Palliative Care Specialist', 'Pathologist', 'Pediatric Cardiologist', 'Pediatric Neurologist',
  'Pediatric Surgeon', 'Pediatrician', 'Periodontist', 'Physiotherapist', 'Plastic Surgeon',
  'Podiatrist', 'Prosthodontist', 'Psychiatrist', 'Psychologist', 'Pulmonologist', 'Radiologist',
  'Rehabilitation Specialist', 'Rheumatologist', 'Sleep Medicine Specialist', 'Speech Therapist',
  'Spine Surgeon', 'Sports Medicine Specialist', 'Toxicologist', 'Transplant Surgeon',
  'Urologist', 'Vascular Surgeon'
].sort((a, b) => a.localeCompare(b))

export const pakistaniCities = [
  'Abbottabad', 'Bahawalpur', 'Chiniot', 'Dera Ghazi Khan', 'Faisalabad', 'Gilgit', 'Gujranwala',
  'Gujrat', 'Hyderabad', 'Islamabad', 'Jacobabad', 'Jhang', 'Karachi', 'Kasur', 'Khuzdar',
  'Larkana', 'Lahore', 'Mardan', 'Mingora', 'Mirpur', 'Mirpur Khas', 'Multan', 'Muzaffarabad',
  'Nawabshah', 'Okara', 'Peshawar', 'Quetta', 'Rahim Yar Khan', 'Rawalpindi', 'Sahiwal',
  'Sargodha', 'Sheikhupura', 'Sialkot', 'Sukkur'
]

const iconRules = [
  [/dent|dontist|perio|maxillo|oral|prosth/i, Smile],
  [/neuro|psych|brain|sleep/i, Brain],
  [/pediatric|neonat|child/i, Baby],
  [/\bent\b|audiolog|speech/i, Ear],
  [/ophthal|eye|optom|retina/i, Eye],
  [/dermat|skin|hair/i, Shield],
  [/gyn|obstet|fertil/i, User],
  [/gastro|hepat|colorectal|nutrition|diet/i, Pill],
  [/pulmo|respir|lung/i, Wind],
  [/^uro|nephro|kidney|transplant/i, Droplets],
  [/onco|hemat|patholog|radiolog|nuclear|genet|toxic/i, Microscope],
  [/cardio|vascular|heart/i, Heart],
  [/surg/i, Scissors],
  [/anesth|pain|critical|emergency|palliative/i, Syringe],
  [/homeo|hakeem|unani/i, Leaf],
  [/endocrin|diabet|rheumat|infect|geriatr/i, Activity],
  [/physio|rehab|sports|chiro|podiat|occupational|ortho|spine/i, Bone]
]

export const getSpecializationIcon = (name = '') => {
  const rule = iconRules.find(([regex]) => regex.test(name))
  return rule ? rule[1] : Stethoscope
}