import {Injectable} from '@angular/core';
import {TimeOfDay} from "../timeOfDay";
import {WeatherType} from "../weatherType";

@Injectable({
  providedIn: 'root'
})
export class DayWeatherService {

  private timeColors: Record<TimeOfDay, string> = {
    'morning': '#FFB6C1',
    'afternoon': '#87CEEB',
    'evening': '#FF7F50',
    'night': '#191970',
  };

  private weatherColors: Record<WeatherType, string> = {
    'sunny': '',
    'moderate': '#F5F5F5',
    'overcast': '#959595',
    'rainy': '#5c5c5c',
  };

  getTimeOfDayColor(timeOfDay: string): string {
    return this.timeColors[timeOfDay as TimeOfDay] || '#FFFFFF';
  }

  getWeatherTypeColor(weatherType: string): string {
    return this.weatherColors[weatherType as WeatherType] || '#FFFFFF';
  }
}
