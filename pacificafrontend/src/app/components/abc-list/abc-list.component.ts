import { Component, OnInit } from '@angular/core';
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
  dateIndex: number = 0;
  authorIndex: number = 1;
  notesIndex: number = 2;
  header: string[] = [];
  reportData: Report[] = [];

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private sheetService: ReportService,
  ) { }

  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate(['/login']);
    }
    let foundData = localStorage.getItem('abcData');
    if(foundData) {
      this.reportData = JSON.parse(foundData);
      this.content = JSON.parse(foundData);
    } else {
      this.sheetService.getAllABCs().subscribe(
        data => {
          localStorage.setItem('abcData', JSON.stringify(data));
          this.reportData = data;
          this.content = JSON.stringify(data);
        },
        err => {
          this.content = JSON.parse(err.error).message;
        }
      );
    }
  }
}
