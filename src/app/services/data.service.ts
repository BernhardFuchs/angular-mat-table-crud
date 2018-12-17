import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Issue} from '../models/issue';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DataService {
  private readonly API_URL = 'https://api.github.com/repos/angular/angular/issues';

  constructor (private httpClient: HttpClient) {
    console.log('####DataService constructor');
  }

  getAllIssues(): Observable<Issue[]> {
    return this.httpClient.get<Issue[]>(this.API_URL);
  }

}
