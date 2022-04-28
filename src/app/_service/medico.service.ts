import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../_model/medico';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService extends GenericService<Medico>{

  private medicoCambio: Subject<Medico[]> = new Subject<Medico[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/medicos`);
  }

  getMedicoCambio(){
    return this.medicoCambio.asObservable();
  }

  setMedicoCambio(medicos: Medico[]){
    this.medicoCambio.next(medicos);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensajeCambio: string){
    this.mensajeCambio.next(mensajeCambio);
  }
}
