import {Component, Input, OnInit} from '@angular/core';
import {Report} from "../../models/report.model";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token-storage.service";
import {ReportService} from "../../services/report.service";

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
  selected: any;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private sheetService: ReportService,
  ) { }

  ngOnInit(): void {
    let foundData = localStorage.getItem('abcData');
    if(foundData) {
      this.reportData = JSON.parse(foundData);
      this.content = JSON.parse(foundData);
      this.setClientOptions();
    } else {
      this.sheetService.getAllABCs().subscribe(
        (data: Report[]) => {
          localStorage.setItem('abcData', JSON.stringify(data));
          this.reportData = data;
          this.allData = data;
          this.content = JSON.stringify(data);
          this.setClientOptions();
        },
        err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }

  }

  setClientOptions() {
    function onlyUnique(value: any, index: any, self: string | any[]) {
      return self.indexOf(value) === index;
    }
    console.log("this.allData:", this.allData);
    let clientList = this.allData.map((d: Report) => d?.client!).filter(onlyUnique);
    console.log("clientList:", clientList);
    this.clients = ['All'].concat(this.allData.map((d: Report) => d?.client!).filter(onlyUnique));
  }

  onClientSelect() {
    this.reportData = this.selected === 'All'
      ? this.allData
      : this.allData.filter((report: Report) => {
          return report.client === this.selected;
        })
  }
}
