import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = ['idPaciente', 'nombres', 'apellidos', 'acciones'];
  cantidad: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private pacientesService: PacienteService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {

    this.pacientesService.getPacienteCambio().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.pacientesService.getMensajeCambio().subscribe(data=>{
      this.snackBar.open(data, 'AVISO', {duration: 2000})
    });

    this.pacientesService.listarPageable(0, 10).subscribe(data =>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });

    /*
    this.pacientesService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });*/
  }

  filtrar(e: any){
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  eliminar(id: number){
    this.pacientesService.eliminar(id).subscribe(() => {
      this.pacientesService.listar().subscribe(data => {
        this.pacientesService.setPacienteCambio(data);
        this.pacientesService.setMensajeCambio('SE ELIMINÓ');
      });
    });
  }

  mostrarMas(e: any){
    this.pacientesService.listarPageable(e.pageIndex, e.pageSize).subscribe(data =>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

}
