import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { SignosVitalesService } from 'src/app/_service/signos.service';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  dataSource: MatTableDataSource<SignosVitales>;
  displayedColumns: string[] = ['id', 'paciente', 'pulso', 'temperatura', 'ritmo','acciones'];
  cantidad: number = 0;

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort : MatSort;

  constructor(
    private signosVitalesService: SignosVitalesService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.signosVitalesService.getSignosVitalesCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signosVitalesService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration:2000})
    });

    this.signosVitalesService.listarPageable(0, 10).subscribe(data =>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  filtrar(e: any){
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  eliminar(id: number){
    console.log(id);
    this.signosVitalesService.eliminar(id).subscribe(() => {
      this.signosVitalesService.listar().subscribe(data => {
        this.signosVitalesService.setSignosVitalesCambio(data);
        this.signosVitalesService.setMensajeCambio('SE ELIMINÓ');
      });
    });
  }

  mostrarMas(e: any){
    this.signosVitalesService.listarPageable(e.pageIndex, e.pageSize).subscribe(data =>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  verificarHijos(){
    return this.route.children.length !== 0;
  }

}
