import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';
import { FiltroConsultaDTO } from 'src/app/dto/FiltroConsultaDTO';
import { Consulta } from 'src/app/_model/consulta';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { BuscarDialogoComponent } from './buscar-dialogo/buscar-dialogo.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form: FormGroup;
  displayedColumns = ['paciente', 'medico', 'especialidad', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Consulta>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tab') tabGroup: MatTabGroup;

  constructor(
    private consultaService: ConsultaService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'dni': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta1': new FormControl(''),
      'fechaConsulta2': new FormControl(''),
    });
  }

  buscar(){
    if(this.tabGroup.selectedIndex == 0){
    let dni = this.form.value['dni'];
    let nombreCompleto = this.form.value['nombreCompleto'];

    let filtro = new FiltroConsultaDTO(dni, nombreCompleto.toLowerCase());

    if(filtro.dni.length === 0){
      delete filtro.dni;
    }

    if(filtro.nombreCompleto.length === 0){
      delete filtro.nombreCompleto;
    }
    this.consultaService.buscarOtros(filtro).subscribe(data => this.crearTabla(data));
  } else {
    let fecha1 = this.form.value['fechaConsulta1'];
    fecha1 = moment(fecha1).format('YYYY-MM-DDTHH:mm:ss');
    let fecha2 = this.form.value['fechaConsulta2'];
    fecha2 = moment(fecha2).format('YYYY-MM-DDTHH:mm:ss');

    this.consultaService.buscarFecha(fecha1, fecha2).subscribe(data => this.crearTabla(data));
  }


  }

  crearTabla(data: Consulta[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  verDetalle(consulta: Consulta){
    this.dialog.open(BuscarDialogoComponent, {
      width: '750px',
      data: consulta
    })
  }

}
