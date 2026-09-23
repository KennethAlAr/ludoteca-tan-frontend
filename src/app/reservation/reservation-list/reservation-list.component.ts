import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss',
})
export class ReservationListComponent implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Reservation>();
  displayedColumns: string[] = ['id', 'game', 'client', 'startDate', 'endDate', 'action'];

  constructor(private reservationService: ReservationService, public dialog: MatDialog) {}

  ngOnInit(): void {
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

    this.reservationService.getReservations(pageable).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = pageable.pageSize;
      this.totalElements = data.totalElements;
    });
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
