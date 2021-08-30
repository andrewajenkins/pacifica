import { Component, OnInit } from '@angular/core';
import {ReportService} from "../../services/report.service";

@Component({
  selector: 'app-sheets-list',
  templateUrl: './sheets-list.component.html',
  styleUrls: ['./sheets-list.component.scss']
})
export class SheetsListComponent implements OnInit {

  data = "no data yet";
  constructor(private sheetService: ReportService) { }

  ngOnInit(): void {
    // let result = this.sheetService.deleteAll()
    // result.subscribe(k => {
    //   console.log("got response test!:", k);
    //   this.data = JSON.stringify(k);
    // })
  }

}
