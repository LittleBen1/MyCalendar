import { Component, OnInit } from '@angular/core';
import {WeatherService} from '../weather.service';

@Component({
selector: 'app-weather',
templateUrl: './weather.component.html',
styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

// les four propriétés de notre component
  forecast: any[];
  errorMessage: any;
  city: string;
  disabledForecastbutton: boolean = true;

  ngOnInit(): void {
  }

  constructor(private weatherService: WeatherService) { }
  // la méthode qui récupère les données émis par le openweather api
  fetchData(city: string){
    this.weatherService.fetchWeather(city).
    subscribe( data => {data = this.forecast; }, error => {
    this.errorMessage = <any>error;
    console.log(error)
     }
    )
  }
  // la methode de la soumission
  onSubmit(){
    this.weatherService.fetchWeather(this.city).subscribe(data => { data = this.forecast;},
    error => error = this.errorMessage);
    this.onResetControls();
  }
  
  //la methode pour performer la recherhce
  onSearch(event: Event){
    this.city = (<HTMLInputElement>event.target).value;
    this.disabledForecastbutton = false;
  }

// la méthode pour réinitialiser la forme après soumission
  onResetControls() {
    this.city = '';
    this.disabledForecastbutton = true;
    }
  }
