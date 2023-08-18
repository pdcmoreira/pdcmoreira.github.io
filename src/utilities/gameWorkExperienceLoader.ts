import workExperienceJson from '@/assets/game/workExperience.json'

type Experience = {
  name: string
  messages: string[]
}

export const workExperience = workExperienceJson as { [key: string]: Experience }

export const getExperience = (name: string): Experience | null =>
  (workExperience[name] as Experience) || null
