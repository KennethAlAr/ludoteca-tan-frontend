import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Reservation } from './model/Reservation';
import { PaginatedData } from '../core/model/page/PaginatedData';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  protected readonly http = inject(HttpClient);

  private baseUrl = 'http://localhost:8080/reservation';

  getReservations(search: { pageable: Pageable, gameId: number | null, clientId: number | null, date: string | null }): Observable<PaginatedData<Reservation>> {
    return this.http.post<PaginatedData<Reservation>>(this.baseUrl, search);
  }

  saveReservation(reservation: Reservation): Observable<Reservation> {
    const { id } = reservation;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;

    return this.http.put<Reservation>(url, reservation);
  }

  deleteReservation(idReservation: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idReservation}`);
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.baseUrl);
  }  
}
