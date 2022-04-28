import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConsultaListaExamenDTO } from '../dto/consultaListaExamenDTO';
import { FiltroConsultaDTO } from '../dto/FiltroConsultaDTO';
import { Consulta } from '../_model/consulta';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService extends GenericService<Consulta>{

  private consultaCambio = new Subject<Consulta[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected override http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/consultas`);
  }

  registrarTransaccion(consultaDTO:ConsultaListaExamenDTO){
    return this.http.post(this.url, consultaDTO);
  }

  buscarFecha(fecha1: string, fecha2: string){
    return this.http.get<Consulta[]>(`${this.url}/buscar?fecha1=${fecha1}&fecha2=${fecha2}`);
  }

  buscarOtros(filtroConsulta: FiltroConsultaDTO){
    return this.http.post<Consulta[]>(`${this.url}/buscar/otros`, filtroConsulta);
  }

  listarExamenPorConsulta(idConsulta: number){
    return this.http.get<ConsultaListaExamenDTO>(`${environment.HOST}/consultaexamenes/${idConsulta}`);
  }

  listarResumen(){
    return this.http.get<any[]>(`${this.url}/listarResumen`);
  }

  //pdfs
  generarReporte(){
    return this.http.get(`${this.url}/generarReporte`, {responseType: 'blob'});
  }

  //archivos
  subirArchivo(data: File){
    let formdata: FormData = new FormData();
    formdata.append('adjunto', data);
    return this.http.post(`${this.url}/guardarArchivo`, formdata);
  }

  leerArchivo(id: number){
    return this.http.get(`${this.url}/leerArchivo/${id}`,{
      responseType: 'blob'
    });
  }

}
