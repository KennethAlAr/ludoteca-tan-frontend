import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from './model/Login';
import { LoginResponse } from './model/login.response';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    protected readonly http = inject(HttpClient);
    readonly isAdmin = signal(this.checkAdmin());
    readonly userName = signal(this.getUserName());

    private baseUrl = 'http://localhost:8080/auth';

    login(login: Login): Observable<LoginResponse> {
        const { name, password } = login;
        const url = this.baseUrl;

        return this.http.post<LoginResponse>(url, login);
    }

    private checkAdmin(): boolean {
        const token = localStorage.getItem('token');

        if (token) {
            const payload = jwtDecode(token) as any;
            if (payload.role === 'ADMIN') {
                return true;
            }
        }
        return false;
    }

    updateAuthState(): void {
        this.isAdmin.set(this.checkAdmin());
    }

    getUserName(): string {
        const token = localStorage.getItem('token');

        if(token) {
            const payload = jwtDecode(token) as any;
            return payload.sub;
        }

        return null;
    }

    updateUserName(): void {
        this.userName.set(this.getUserName());
    }
}
