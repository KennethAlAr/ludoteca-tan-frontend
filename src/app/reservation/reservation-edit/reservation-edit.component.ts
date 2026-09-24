import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../model/Reservation';
import { GameService } from '../../game/game.service';
import { Game } from '../../game/model/Game';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/model/Client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { validateFields } from '../../core/helpers/validation.helper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { SpanishDateAdapter } from '../../core/adapters/spanish-date.adapter';
import { formatLocalDate, parseLocalDate } from '../../core/helpers/date-converter.helper';


@Component({
  selector: 'app-reservation-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './reservation-edit.component.html',
  styleUrl: './reservation-edit.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: SpanishDateAdapter }
  ]
})
export class ReservationEditComponent implements OnInit {
  protected readonly id = signal<number | null>(null);
  protected readonly gameId = signal<number | null>(null);
  protected readonly clientId = signal<number | null>(null);
  protected readonly startDate = signal<Date | null>(null);
  protected readonly endDate = signal<Date | null>(null);
  protected readonly games = signal<Game[]>([]);
  protected readonly clients = signal<Client[]>([]);

  protected readonly dialogRef = inject(MatDialogRef<ReservationEditComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly reservationService = inject(ReservationService);
  protected readonly gameService = inject(GameService);
  protected readonly clientService = inject(ClientService);

  ngOnInit(): void {
    this.loadFormData(this.data.reservation ?? null);
  }

  loadFormData(initialData: Reservation | null): void {
    this.id.set(initialData?.id ?? null);

    this.gameService.getGames().subscribe((games) => {
      this.games.set(games);
      this.gameId.set(initialData?.game?.id ?? null);
    });

    this.clientService.getClients().subscribe((clients) => {
      this.clients.set(clients);
      this.clientId.set(initialData?.client?.id ?? null);
    });

    this.startDate.set(initialData?.startDate ? parseLocalDate(initialData.startDate) : null);
    this.endDate.set(initialData?.endDate ? parseLocalDate(initialData.endDate) : null);
  }

  onSave() {
    const id = this.id();
    const gameId = this.gameId();
    const clientId = this.clientId();
    const startDate = this.startDate();
    const endDate = this.endDate();

    const requiredFields = ["gameId", "clientId", "startDate", "endDate"] as const;
    const data = { gameId, clientId, startDate, endDate };

    if (!validateFields(data, requiredFields)) {
      return;
    }

    const reservation = {
      id,
      game: this.games().find(g => g.id === gameId) ?? null,
      client: this.clients().find(c => c.id === clientId) ?? null,
      startDate: formatLocalDate(startDate),
      endDate: formatLocalDate(endDate),
    } as Reservation;
    
    this.reservationService.saveReservation(reservation).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}