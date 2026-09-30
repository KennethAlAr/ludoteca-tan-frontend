import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../login.service';
import { Login } from '../model/Login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { validateFields } from '../../helpers/validation.helper';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected readonly dialogRef = inject(MatDialogRef<LoginComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA) as { login: Login };
  protected readonly loginService = inject(LoginService);

  protected readonly name = signal<string | null>(null);
  protected readonly password = signal<string | null>(null);
  protected readonly loginErrorMessage = signal<string | null>(null);

  onLogin() {
    this.loginErrorMessage.set(null);
    const name = this.name();
    const password = this.password();

    const requiredFields = ["name", "password"] as const
    const data = { name, password }

    if (!validateFields(data, requiredFields)) {
      return;
    }

    const login = { name, password } as Login;

    this.loginService.login(login).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.loginService.updateAuthState();
        this.loginService.updateUserName();
        this.dialogRef.close(true);
      }, error: (error) => {
        if (error.status === 401) {
          this.loginErrorMessage.set("El nombre de usuario o la contraseña son incorrectos.");
        }
      }
      
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
