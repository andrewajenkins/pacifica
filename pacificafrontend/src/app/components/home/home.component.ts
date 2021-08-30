import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {ReportService} from "../../services/report.service";
import {Report} from "../../models/report.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  content?: string;
  data?: string[][];
  dateIndex: number = 0;
  authorIndex: number = 1;
  notesIndex: number = 2;
  header: string[] = [];
  reportData: Report[] = [];

  constructor(
    private userService: UserService,
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
