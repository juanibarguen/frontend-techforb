import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = "frontend-techforb"
  isLoginMode = true; // Para alternar entre login y registro

  // Alternar entre los formularios
  toggleForm() {
    this.isLoginMode = !this.isLoginMode;
  }
}