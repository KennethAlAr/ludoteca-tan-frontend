import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReservationEditComponent } from '../reservation-edit/reservation-edit.component';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../model/Reservation';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { ClientService } from '../../client/client.service';
import { GameService } from '../../game/game.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { formatLocalDate } from '../../core/helpers/date-converter.helper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { SpanishDateAdapter } from '../../core/adapters/spanish-date.adapter';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: SpanishDateAdapter }
  ]
})
export class ReservationListComponent implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Reservation>();
  displayedColumns: string[] = ['id', 'game', 'client', 'startDate', 'endDate', 'action'];

  protected readonly filterGame = signal<Game | null>(null);
  protected readonly filterClient = signal<Client | null>(null);
  protected readonly filterDate = signal<Date | null>(null);
  protected readonly games = signal<Game[]>([]);
  protected readonly clients = signal<Client[]>([]);

  protected readonly reservationService = inject(ReservationService);
  protected readonly gameService = inject(GameService);
  protected readonly clientService = inject(ClientService);
  protected readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => this.games.set(games));
    this.clientService.getClients().subscribe((clients) => this.clients.set(clients));
    this.loadPage();
  }

  loadPage(event?: PageEvent) {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    const search = {
      pageable,
      gameId: this.filterGame() != null ? this.filterGame().id : null,
      clientId: this.filterClient() != null ? this.filterClient().id : null,
      date: this.filterDate() != null ? formatLocalDate(this.filterDate()) : null
    }

    this.reservationService.getReservations(search).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  onCleanFilter(): void {
    this.filterGame.set(null);
    this.filterClient.set(null);
    this.filterDate.set(null);
    this.pageNumber = 0;
    this.loadPage();
  }

  onSearch(): void {
    this.pageNumber = 0;
    this.loadPage();
  }


  createReservation() {
    const dialogRef = this.dialog.open(ReservationEditComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  editReservation(reservation: Reservation) {
    const dialogRef = this.dialog.open(ReservationEditComponent, {
      data: { reservation: reservation },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  deleteReservation(reservation: Reservation) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar reserva',
        description: `Atención si borra la reserva se perderán sus datos.<br> ¿Desea eliminar la reserva?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reservationService.deleteReservation(reservation.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }
}
