import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, switchMap } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignosVitalesService } from 'src/app/_service/signos.service';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  id: number;
  signosVitales: SignosVitales;
  pacientes: Paciente[];
  form: FormGroup;
  temperatura: string;
  ritmo: string;
  pulso: string;
  edicion: boolean = false;
//Útil para saber cuando hemos escrito en el input
  myControlPaciente: FormControl = new FormControl();
//Observable resultado de los filtrados
  pacientesFiltrados$: Observable<Paciente[]>;  

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();
  pacienteSeleccionado: Paciente;

  constructor(
    private pacienteService: PacienteService,
    private signosVitalesService: SignosVitalesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.signosVitales = new SignosVitales();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'pulso': new FormControl(''),
      'temperatura': new FormControl(''),
      'ritmo': new FormControl(''),
      'fecha': new FormControl(new Date())
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });

    this.listarInicial();
    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)))

  }

  initForm(){
    if(this.edicion){
      this.signosVitalesService.listarPorId(this.id).subscribe(data => {
        let id = data.id;
        let paciente = data.paciente;
        let ritmo = data.ritmo;
        let pulso = data.pulso;
        let temperatura = data.temperatura;
        let fecha = data.fecha;

        this.form = new FormGroup({
          'id': new FormControl(id),
          'paciente': new FormControl(paciente),
          'pulso': new FormControl(pulso),
          'temperatura': new FormControl(temperatura),
          'ritmo': new FormControl(ritmo),
          'fecha': new FormControl(fecha)
        });
      });
    }
  }

  listarInicial(){
    this.pacienteService.listar().subscribe(data =>{
      this.pacientes = data;
    });
  }

  filtrarPacientes(val: any){

    if(val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni))
    }

    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
      );
  }

  mostrarPaciente(val: any){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }


  operar(){
    this.signosVitales.id = this.form.value['id']
    this.signosVitales.paciente = this.form.value['paciente']
    this.signosVitales.pulso = this.form.value['pulso']
    this.signosVitales.ritmo = this.form.value['ritmo']
    this.signosVitales.temperatura = this.form.value['temperatura']
    this.signosVitales.fecha = this.form.value['fecha']
    

    if(this.signosVitales != null && this.signosVitales.id > 0){
      //Buena Practica
      this.signosVitalesService.modificar(this.signosVitales).pipe(switchMap(() => {
        return this.signosVitalesService.listar();
      })).subscribe(data => {
        this.signosVitalesService.setSignosVitalesCambio(data);
        this.signosVitalesService.setMensajeCambio('Se modificó');
      });
    }else{
      //Practica Común
      this.signosVitalesService.registrar(this.signosVitales).subscribe(data => {
        this.signosVitalesService.listar().subscribe(signos => {
          this.signosVitalesService.setSignosVitalesCambio(signos);
          this.signosVitalesService.setMensajeCambio('Se registró');
        });
      });
    }

    this.router.navigate(['/pages/signos']);
  }
  /*
  aceptar(){
    let signosVitales = new SignosVitales();
    signosVitales.paciente = this.form.value['paciente'];
    signosVitales.ritmo = this.form.value['ritmo'];
    signosVitales.pulso = this.form.value['pulso'];
    signosVitales.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    console.log('aceptarrrr');
    console.log(signosVitales.fecha);
    console.log(signosVitales.paciente.idPaciente);
    this.signosVitalesService.registrar(signosVitales).subscribe(() => {
      this.snackBar.open('Se registró', 'AVISO', {duration: 200});

      setTimeout(() => {
        this.limpiarControles();
      }, 200)
    });
  }

  limpiarControles(){
    this.pacienteSeleccionado = null;
    this.pulso = "";
    this.ritmo = "";
    this.temperatura = "";
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.myControlPaciente.reset();
  }*/
}
