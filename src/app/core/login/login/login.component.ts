import { Component, OnInit, inject, signal } from '@angular/core';
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

  onLogin() {
    const name = this.name();
    const password = this.password();

    const requiredFields = ["name", "password"] as const
    const data = { name, password }

    if (!validateFields(data, requiredFields)) {
      return;
    }

    const login = { name, password } as Login;
    this.loginService.login(login).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
