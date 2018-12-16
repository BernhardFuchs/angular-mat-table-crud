import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Issue} from '../models/issue';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class DataService {
  private readonly API_URL = 'https://api.github.com/repos/angular/angular/issues';

  dataChange: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>([]);

  constructor (private httpClient: HttpClient) {
    console.log('####DataService constructor this.dataChange: ', this.dataChange);
    console.log('####DataService constructor this.dataChange.value: ', this.dataChange.value);
    console.log('####DataService constructor this.data.values: ', this.data.values);
  }

  get data(): Issue[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllIssues(): void {
    this.httpClient.get<Issue[]>(this.API_URL).subscribe(data => {
      console.log('####DataService getAllIssues this.dataChange: ', this.dataChange);
    console.log('####DataService getAllIssues this.dataChange.value: ', this.dataChange.value);
    console.log('####DataService getAllIssues this.data.values: ', this.data.values);
      console.log('####DataService getAllIssues data:', data);
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

}
