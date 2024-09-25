import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthApiService } from 'src/app/Service/AuthApi.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$ = new BehaviorSubject<boolean>(false);
  hasError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: AuthApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]]
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading$.next(true);
    const { email, password } = this.loginForm.value;
    this.apiService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading$.next(false);
        console.log('Login Success:', response);
        this.router.navigate(['/dashboard']); // Adjust as needed
      },
      error: (error) => {
        this.isLoading$.next(false);
        this.hasError = true;
        console.error('Login Error:', error);
      }
    });
  }
}
