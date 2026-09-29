import {CommonModule} from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../login/login/login.component';
import { LoginService } from '../login/login.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly categoryService = inject(LoginService);
  protected readonly dialog = inject(MatDialog);

  login() {
    const dialogRef = this.dialog.open(LoginComponent);
  }
  
}