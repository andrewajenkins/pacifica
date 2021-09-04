import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Report} from "../../models/report.model";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token-storage.service";
import {ReportService} from "../../services/report.service";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {map, startWith} from "rxjs/operators";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-abc-list',
  templateUrl: './abc-list.component.html',
  styleUrls: ['./abc-list.component.scss']
})
export class AbcListComponent implements OnInit {
  content?: string;
  data?: string[][];
  reportData: Report[] = [];
  allData: Report[] = [];
  clients: string[] = [];
  selected: any = 'All';
  dataSource: any;
  displayedColumns: string[] = ['timestamp', 'client', 'staff', 'behavior']
  columnsToDisplay: string[] = this.displayedColumns.slice();

  // auto-complete chip
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allIpps: string[] = [];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private sheetService: ReportService,
  ) {
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allIpps.slice()));
  }

  ngOnInit(): void {
    let foundData = localStorage.getItem('abcData');
    console.log("foundData:", foundData);
    if(foundData) {
      this.reportData = JSON.parse(foundData);
      this.content = JSON.parse(foundData);
      this.dataSource = JSON.parse(foundData);
      this.allData = JSON.parse(foundData);
      this.allIpps = this.allData.filter(r => {
        if(this.selected === 'All') return true;
        return r.client === this.selected
      }).map(k => k.ipp!);
      console.log("this.allData:", this.allData);
      this.setClientOptions();
    } else {
      this.sheetService.getAllABCs().subscribe(
        (data: Report[]) => {
          data.forEach((k: Report) => {
            k.timestamp = new DatePipe('en-US').transform(k.timestamp, "M/d/yy h:mm a")!
            return;
          })
          localStorage.setItem('abcData', JSON.stringify(data));
          this.reportData = data;
          this.allData = data;
          this.dataSource = data;
          this.content = JSON.stringify(data);
          this.allIpps = data.filter(r => {
            if(this.selected === 'All') return true;
            return r.client === this.selected
          }).map(k => k.ipp!);
          console.log("ipps:", data.filter(r => {
            if(this.selected === 'All') return true;
            return r.client === this.selected
          }).map(k => k.ipp!))
          this.setClientOptions();
        },
        err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }

  }

  onlyUnique(value: any, index: any, self: string | any[]) {
    return self.indexOf(value) === index;
  }

  setClientOptions() {

    console.log("this.allData:", this.allData);
    let clientList = this.allData.map((d: Report) => d?.client!).filter(this.onlyUnique);
    console.log("clientList:", clientList);
    this.clients = ['All'].concat(this.allData.map((d: Report) => d?.client!).filter(this.onlyUnique));
  }

  onClientSelect() {
    this.reportData = this.selected === 'All'
      ? this.allData
      : this.allData.filter((report: Report) => {
          return report.client === this.selected;
        })
    this.dataSource = this.selected === 'All'
      ? this.allData
      : this.allData.filter((report: Report) => {
          return report.client === this.selected;
        })
    this.allIpps = this.allData.filter(r => {
        if(this.selected === 'All') return true;
        return r.client === this.selected
      }).map(k => k.ipp!).filter(this.onlyUnique);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }

    this.dataSource = this.allData;
    this.onClientSelect();
  }

  selectedFruit(event: MatAutocompleteSelectedEvent): void {
    console.log("select chip!:", event);
    this.fruits.push(event.option.viewValue);
    // @ts-ignore
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    this.dataSource = this.dataSource.filter((k: { ipp: any; }) => {
      return k.ipp === event.option.value;
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
// this.allData.filter(r => r.client === this.selected).map(k => k.ipp!);
    return this.allIpps.filter(fruit => fruit?.toLowerCase().includes(filterValue));
  }
}
