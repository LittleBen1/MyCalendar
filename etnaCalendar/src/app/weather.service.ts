import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Config} from './weather.constant';
import { JsonPipe } from '@angular/common';

@Injectable()
export class WeatherService {
private BaseUrl = 'https://api.openweathermap.org/data/2.5/';
  constructor(private http: HttpClient) { }
    fetchWeather(ville) {
        return this.http.get( this.BaseUrl + 'weather?q=' + ville + '&appid=' + Config.cleapi)
         //.catch(this.handleError);;
        //.map(reponse => {reponse.json(); console.log(reponse); });
    }

  private handleError(error: any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
    }

    // ionViewDieLoad() {
    //   let self = this;
    //   self.storage.get('data').then((data:any) => {
    //     if (data) {
    //       self.fetchWeatherData().then((res: any) => {
    //         self.weatherData = JSON.parse(res._body)['list'];
    //         self.storage.set('data', res);
    //       }).catch(erro => {});
    //     }
    //   });
    // }

    // fetchWeatherData() {
    //   let self = this;
    //   return new Promise(resolve, reject) => {
    //     const headerDict = {
    //       'Content-type': 'application/json'
    //     };
    //     const headerObj = { headers: new Headers(headerDict) };
    //     const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?id=4898722&APPID=7ff7bf0363b3ede0e08ce4526dbf972a';
    //   }
    // }

  }
