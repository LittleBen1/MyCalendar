import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data = [];

  setData(data) {
    this.data = [];
    this.data.push(data);
  }

  getDataWithId(id) {
     return this.data[id];
  }

  getData() { 
    return this.data;
  }
  constructor() { }
}
