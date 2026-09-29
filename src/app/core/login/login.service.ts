import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from './model/Login';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/client';

    login(login: Login): Observable<Login> {
        const { name, password } = login;
        const url = this.baseUrl;

        return this.http.put<Login>(url, login);
    }
}
