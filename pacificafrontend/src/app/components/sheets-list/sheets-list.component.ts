import { Component, OnInit } from '@angular/core';
import {SheetService} from "../../services/sheet.service";

@Component({
  selector: 'app-sheets-list',
  templateUrl: './sheets-list.component.html',
  styleUrls: ['./sheets-list.component.scss']
})
export class SheetsListComponent implements OnInit {

  data = "no data yet";
  constructor(private sheetService: SheetService) { }

  ngOnInit(): void {
    let result = this.sheetService.deleteAll()
    result.subscribe(k => {
      console.log("got response:", k);
      this.data = k;
    })
  }

}
