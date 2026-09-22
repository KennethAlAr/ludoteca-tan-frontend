import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '../model/Client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../client.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { ClientEditComponent } from '../client-edit/client-edit.component';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule,
        MatDialogModule
    ],
    templateUrl: './client-list.component.html',
    styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit{

    dataSource = new MatTableDataSource<Client>();
    displayedColumns: string[] = ['id', 'name', 'action'];

    protected readonly clientService = inject(ClientService);
    protected readonly dialog = inject(MatDialog);

    loadData(): void {
        this.clientService.getClients().subscribe(
            clients => this.dataSource.data = clients
        );
    }

    ngOnInit(): void {
        this.loadData();
    }

    createClient() {
      const dialogRef = this.dialog.open(ClientEditComponent, {
          data: {}
      });

    dialogRef.afterClosed().subscribe(result => {
        if(!result) return;
        this.loadData();
      });
    }

    editClient(client: Client) {
      const dialogRef = this.dialog.open(ClientEditComponent, {
        data: { client }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(!result) return;
        this.loadData();
      });
    }

    deleteClient(client: Client) {
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: {
          title: 'Borrar Cliente',
          description: `Atención si borra el cliente se perderán sus datos.<br> ¿Desea borrar al cliente "${client.name}"?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(!result) return;
        this.clientService.deleteClient(client.id).subscribe(() => {
          this.loadData();
        });
      });
    }
}
