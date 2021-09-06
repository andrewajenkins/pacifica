import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Report} from "../../models/report.model";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token-storage.service";
import {ReportService} from "../../services/report.service";
import {FormControl} from "@angular/forms";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-abc-list',
  templateUrl: './abc-list.component.html',
  styleUrls: ['./abc-list.component.scss']
})
export class AbcListComponent implements OnInit {
  content?: string;
  data?: string[][];
  allData: Report[] = [];
  clients: string[] = [];
  selected: any = 'All';
  dataSource: Report[];
  displayedColumns: string[] = ['timestamp', 'client', 'staff', 'behavior']
  columnsToDisplay: string[] = this.displayedColumns.slice();

  // auto-complete chip
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  ippCtrl = new FormControl();
  filteredIPPs: string[];
  ipps: string[] = [];

  @ViewChild('fruitInput') ippInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private sheetService: ReportService,
  ) {}

  ngOnInit(): void {
    let foundData = localStorage.getItem('abcData');
    if(foundData) {
      this.initializeData(JSON.parse(foundData));
    } else {
      this.sheetService.getAllABCs().subscribe(
        (data: Report[]) => {
          data.forEach((k: Report) => {
            k.timestamp = new DatePipe('en-US').transform(k.timestamp, "M/d/yy h:mm a")!
            return;
          })
          localStorage.setItem('abcData', JSON.stringify(data));
          this.initializeData(data);
        },
        err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }

  }

  initializeData(data: Report[]) {
    this.allData = data;
    this.dataSource = data;
    this.content = JSON.stringify(data);
    this.filterIPPs();
    this.setClientOptions();
  }

  onlyUnique(value: any, index: any, self: string | any[]) {
    return self.indexOf(value) === index;
  }

  setClientOptions() {
    let clientList = this.allData.map((d: Report) => d?.client!).filter(this.onlyUnique);
    this.clients = ['All'].concat(this.allData.map((d: Report) => d?.client!).filter(this.onlyUnique));
  }

  onClientSelect() {
    this.filterABCs();
    this.filterIPPs();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.ipps.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.ippCtrl.setValue(null);
    this.filterABCs();
  }

  remove(ipp: string): void {
    const index = this.ipps.indexOf(ipp);

    if (index >= 0) {
      this.ipps.splice(index, 1);
    }

    this.dataSource = this.allData;
    this.onClientSelect();
  }

  selectedIPP(event: MatAutocompleteSelectedEvent): void {
    this.ipps.push(event.option.viewValue);
    // @ts-ignore
    this.ippInput.nativeElement.value = '';
    this.ippCtrl.setValue(null);
    this.filterABCs()
  }

  private filterIPPs() {
    this.filteredIPPs = this.allData.filter(r => {
      if(this.selected === 'All') return true;
      return r.client === this.selected
    }).map(k => k.ipp!).filter(ipp => ipp?.indexOf("Outcome") !== -1)
    .filter(this.onlyUnique).concat(['Other'])
    .sort();
  }

  private filterABCs() {
    this.dataSource = this.allData.filter((report: Report) => {
        if(this.selected === 'All') return true;
        return report.client === this.selected
      })
      .filter((k: Report) => {
        if(this.ipps.length) {
          let ippIsInList = this.ipps.includes(k.ipp!);
          let isOtherAndInclude = this.ipps.includes("Other") && k.ipp?.indexOf("Outcome") === -1;
          return ippIsInList || isOtherAndInclude;
        } else return true;
      });
  }
}
