import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  emailFormControl: FormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);

  passwordFormControl: FormControl = new FormControl('', [
      Validators.required,
    ]);

  constructor() { }

  ngOnInit(): void {

  }

  ngOnClick() {

  }
}
