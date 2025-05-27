import {District} from "./district";
import {TimeOfDay} from "../timeOfDay";
import {WeatherType} from "../weatherType";

export interface DayWeatherUpdateDTO {

  timeOfDay: TimeOfDay;
  weatherType: WeatherType;
  districts: District[];
}
