import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment/environment';

const apiKey: string = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getCurrentWeather(loc: string) {
    return this.http.get(`${environment.apiUrl}/weather?q=${loc}&appid=${apiKey}`)
  }

  getForecast(loc: string) {
    return this.http.get(`${environment.apiUrl}/forecast?q=${loc}&appid=${apiKey}`)
  }

  fromWeatherIDtoString(id: number) {
    if (id >= 200 && id <= 232)
      return '<ion-icon name="thunderstorm"></ion-icon>'
    if (id <= 321 && id >= 300)
      return '<ion-icon name="rainy"></ion-icon>'
    if (id <= 531 && id >= 500)
      return '<ion-icon name="rainy"></ion-icon>'
    if (id <= 622 && id >= 600)
      return '<ion-icon name="snow"></ion-icon>'
    if (id <= 781 && id >= 700)
      return '<ion-icon name="sunny"></ion-icon>'
    if (id == 800)
      return '<ion-icon name="sunny"></ion-icon>'
    if (id <= 804 && id >= 801)
      return '<ion-icon name="cloud"></ion-icon>'
  }

} 