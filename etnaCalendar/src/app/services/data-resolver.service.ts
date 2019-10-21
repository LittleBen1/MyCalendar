import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any> {

  constructor(private dataService: DataService) { }

  resolveWithId(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
    return this.dataService.getDataWithId(id);
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.dataService.getData();
  }
}
