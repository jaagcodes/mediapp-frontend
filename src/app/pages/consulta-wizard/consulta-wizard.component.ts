import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { ConsultaListaExamenDTO } from 'src/app/dto/consultaListaExamenDTO';
import { Consulta } from 'src/app/_model/consulta';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { Medico } from 'src/app/_model/medico';
import { Paciente } from 'src/app/_model/paciente';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-consulta-wizard',
  templateUrl: './consulta-wizard.component.html',
  styleUrls: ['./consulta-wizard.component.css']
})
export class ConsultaWizardComponent implements OnInit {

  isLinear: boolean;
  primerFormGroup: FormGroup;
  segundoFormGroup: FormGroup;

  pacientes: Paciente[];
  medicos: Medico[];
  especialidades: Especialidad[];
  examenes: Examen[];

  medicoSeleccionado: Medico;
  pacienteSeleccionado: Paciente;
  especialidadSeleccionada: Especialidad;
  examenSeleccionado: Examen;
  
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  consultorios: number[] = [];
  consultorioSeleccionado: number = 0;

  @ViewChild('stepper') stepper: MatStepper;
  
  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar,
    //Permite agrupar formularios y trabajarlos juntos
    private formBuilder: FormBuilder 
  ) {}

  ngOnInit(): void {
    this.primerFormGroup = this.formBuilder.group({
      cboPaciente: [new FormControl(), Validators.required],
      fecha: [new FormControl(new Date()), Validators.required],
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl('')
    });

    this.segundoFormGroup = this.formBuilder.group({

    });

    this.listarInicial();
    this.listarConsultorios();
    }

    listarConsultorios(){
      for(let i = 1; i <= 100; i++){
        this.consultorios.push(i);
      }
    }

    listarInicial(){
     this.pacienteService.listar().subscribe(data =>{
        this.pacientes = data;
      });

      this.medicoService.listar().subscribe(data => {
        this.medicos = data;
      });

      this.especialidadService.listar().subscribe(data =>{
        this.especialidades = data;
      });

      this.examenService.listar().subscribe(data => {
        this.examenes = data;
      });
    }

    seleccionarPaciente(e: any){
      this.pacienteSeleccionado = e.value;
    }

    seleccionarEspecialidad(e: any){
      this.especialidadSeleccionada = e.value;
    }

    seleccionarMedico(medico: any){
      this.medicoSeleccionado = medico;
    }

    seleccionarConsultorio(c: number){
      this.consultorioSeleccionado = c;
    }

    agregar(){
      if(this.diagnostico != null && this.tratamiento != null){
        let det = new DetalleConsulta();
        det.diagnostico = this.diagnostico;
        det.tratamiento = this.tratamiento;
        this.detalleConsulta.push(det);
        this.diagnostico = null;
        this.tratamiento = null;
      }else{
        this.mensaje = 'Debe agregar un diagnostico y tratamiento';
        this.snackBar.open(this.mensaje, "Aviso", {duration: 2000});
      }
    }

    agregarExamen(){
      if(this.examenSeleccionado){
        let cont = 0;
        for(let i = 0; i < this.examenesSeleccionados.length; i++){
          let examen = this.examenesSeleccionados[i];
          if(examen.idExamen === this.examenSeleccionado.idExamen){
            cont++;
            break;
          }
        }
        if(cont > 0){
          this.mensaje = 'El examen se encuentra en la lista';
          this.snackBar.open(this.mensaje, "Aviso", {duration: 2000});
        } else{
          this.examenesSeleccionados.push(this.examenSeleccionado);
        }
      } else{
        this.mensaje = 'Debe agregar examen';
        this.snackBar.open(this.mensaje, "Aviso", {duration: 2000});
      }
    }

    removerDiagnostico(index: number){
      this.detalleConsulta.splice(index, 1);
    }

    removerExamen(index: number){
      this.examenesSeleccionados.splice(index, 1);
    }

    nextManualStep(){
      if(this.consultorioSeleccionado > 0){
        this.stepper.next();
      } else {
        this.snackBar.open('DEBES SELECCIONAR ASIENTO', 'INFO', {duration: 2000});
      }
    }

    registrar(){
    let consulta = new Consulta();
    consulta.paciente = this.pacienteSeleccionado;
    consulta.medico = this.medicoSeleccionado;
    consulta.especialidad = this.especialidadSeleccionada;
    consulta.numConsultorio = `C${this.consultorioSeleccionado}`;
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open('Se registró', 'Aviso', {duration: 2000});

      setTimeout(() => {
        this.limpiarControles();
      }, 2000)
    });
  }

  limpiarControles(){
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = undefined;
    this.examenSeleccionado = undefined;
    this.especialidadSeleccionada = undefined;
    this.medicoSeleccionado = undefined;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.consultorioSeleccionado = 0;
    this.mensaje = '';
    this.stepper.reset();
  }

}
