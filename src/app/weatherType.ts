export interface WeatherType {
  name: string;
  color: string;
}

export const WeatherTypes: { [key: string]: WeatherType } = {
  TYPE_ONE: {
    name: 'sunny',
    color: 'transparent'
  },
  TYPE_TWO: {
    name: 'moderate',
    color: '#F5F5F5'
  },
  TYPE_THREE: {
    name: 'overcast',
    color: '#959595'
  },
  TYPE_FOUR: {
    name: 'rainy',
    color: '#5c5c5c'
  }
} as const;
