export interface TimeOfDay {
  name: string;
  color: string;
}

export const TimesOfDay: { [key: string]: TimeOfDay } = {
  MORNING: {
    name: 'morning',
    color: '#FFB6C1'
  },
  AFTERNOON: {
    name: 'afternoon',
    color: '#87CEEB'
  },
  EVENING: {
    name: 'evening',
    color: '#FF7F50'
  },
  NIGHT: {
    name: 'night',
    color: '#004098'
  }
} as const;
