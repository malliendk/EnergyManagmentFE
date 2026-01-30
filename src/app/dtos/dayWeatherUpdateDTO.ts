import {TimeOfDay} from "../timeOfDay";
import {WeatherType} from "../weatherType";

export interface DayWeatherUpdateDTO {

  timeOfDay: TimeOfDay;
  weatherType: WeatherType;
  newProductions: Record<number, number>;
  newConsumptions: Record<number, number>;
}
