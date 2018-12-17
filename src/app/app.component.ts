import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from './services/data.service';
import {HttpClient} from '@angular/common/http';
import {MatPaginator, MatSort} from '@angular/material';
import { fromEvent } from 'rxjs';
import {ExampleDataSource} from './services/example-data.source';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  displayedColumns = ['id', 'title', 'state', 'url', 'created_at', 'updated_at'];
  dataService: DataService | null;
  dataSource: ExampleDataSource | null;

  constructor(public httpClient: HttpClient) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    console.log('####AppComponent onInit this.exampleDataBase: ', this.dataService);
    console.log('####AppComponent onInit this.dataSource: ', this.dataSource);
    console.log('####AppComponent onInit this.displayedColumns: ', this.displayedColumns);
    console.log('####AppComponent onInit this.filter: ', this.filter);
    console.log('####AppComponent onInit this.paginator: ', this.paginator);
    console.log('####AppComponent onInit this.sort: ', this.sort);
    this.loadData();
  }

  refresh(): void {
    console.log('####AppComponent refresh this.exampleDataBase: ', this.dataService);
    console.log('####AppComponent refresh this.dataSource: ', this.dataSource);
    console.log('####AppComponent refresh this.displayedColumns: ', this.displayedColumns);
    console.log('####AppComponent refresh this.filter: ', this.filter);
    console.log('####AppComponent refresh this.paginator: ', this.paginator);
    console.log('####AppComponent refresh this.sort: ', this.sort);
    this.loadData();
  }

  public loadData(): void {
    this.dataService = new DataService(this.httpClient);
    console.log('####AppComponent loadData this.exampleDataBase: ', this.dataService);
    this.dataSource = new ExampleDataSource(this.dataService, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          console.log('####AppComponent loadData fromEvent subscribe in if');
          return;
        }
        console.log('####AppComponent loadData fromEvent subscribe this.filter.nativeElement.value: ', this.filter.nativeElement.value);
        this.dataSource.filter = this.filter.nativeElement.value;
        console.log('####AppComponent loadData fromEvent subscribe this.dataSource.filter: ', this.dataSource.filter);
      });
  }
}
