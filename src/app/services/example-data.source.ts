import {Issue} from '../models/issue';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { MatPaginator, MatSort } from '@angular/material';

@Injectable()
export class ExampleDataSource extends DataSource<Issue> {
  _dataChange: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>([]);
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    console.log('####DataSource getFilter FilterChange: ', this._filterChange);
    console.log('####DataSource getFilter FilterChangeValue: ', this._filterChange.value);
    return this._filterChange.value;
  }

  set filter(filter: string) {
    console.log('####DataSource setFilter FilterChange: ', this._filterChange);
    console.log('####DataSource setFilter FilterChangeValue: ', this._filterChange.value);
    this._filterChange.next(filter);
  }

  filteredData: Issue[] = [];
  renderedData: Issue[] = [];

  constructor(public _dataService: DataService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
                super();
                console.log('####DataSource constructor FilterChange: ', this._filterChange);
    console.log('####DataSource constructor FilterChangeValue: ', this._filterChange.value);
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Issue[]> {
    console.log('####DataSource connect FilterChange: ', this._filterChange);
    console.log('####DataSource connect FilterChangeValue: ', this._filterChange.value);
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];
    console.log('####DataSource connect displayDataChanges: ,', displayDataChanges);
    console.log('####DataSource connect exampleDatabase: ,', this._dataService);
    this._dataService.getAllIssues().subscribe(data => {
      console.log('####DataService getAllIssues this.dataChange: ', this._dataChange);
      console.log('####DataService getAllIssues this.dataChange.value: ', this._dataChange.value);
      console.log('####DataService getAllIssues this.data.values: ', data.values);
      console.log('####DataService getAllIssues data:', data);
      this._dataChange.next(data);
    });


    return merge(...displayDataChanges).pipe(map( () => {
      // Filter data
      this.filteredData = this._dataChange.value.slice().filter((issue: Issue) => {
        const searchStr = (issue.id + issue.title + issue.url + issue.created_at).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      console.log('####DataSource connect merge filteredData: ', this.filteredData);
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        console.log('####DataSource connect merge sortedData: ', sortedData);

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        console.log('####DataSource connect merge renderedData: ', this.renderedData);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: Issue[]): Issue[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'title': [propertyA, propertyB] = [a.title, b.title]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;
        case 'url': [propertyA, propertyB] = [a.url, b.url]; break;
        case 'created_at': [propertyA, propertyB] = [a.created_at, b.created_at]; break;
        case 'updated_at': [propertyA, propertyB] = [a.updated_at, b.updated_at]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
