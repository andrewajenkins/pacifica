import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {SheetService} from "../../services/sheet.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  content?: string;
  data?: string[][];
  dateIndex: number = 0;
  notesIndex: number = 1;
  header?: string[];
  constructor(
    private userService: UserService,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private sheetService: SheetService,
  ) { }

  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate(['/login']);
      // this.roles = this.tokenStorage.getUser().roles;
    }
    this.sheetService.deleteAll().subscribe(
    // this.userService.getPublicContent().subscribe(
      data => {
        console.log("data:", data);
        this.data = data['sheet-details'];
        if(this.data?.length) {
          for(let i = 0; i < this.data[0].length; i++) {
            let value: string = this.data[0][i];
            if (/^\d+\/\d+\/\d+\//.test(value))
              this.dateIndex = i;
            if (/note/.test(value.toLowerCase()))
              this.notesIndex = i;
          }
        }
        this.content = JSON.stringify(data);
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
}
