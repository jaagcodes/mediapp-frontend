import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  id: number = 0;
  edicion: boolean = false;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
    ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl(''),
      'email': new FormControl('')
    });

    this.route.params.subscribe(data =>{
      this.id = data['id'];
      this.edicion = data['id']!=null;
      this.initForm();
    })

  }

  initForm(){
    if(this.edicion){
      this.pacienteService.listarPorId(this.id).subscribe(data =>{
        this.form = new FormGroup({
          'id': new FormControl(data.idPaciente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'dni': new FormControl(data.dni),
          'telefono': new FormControl(data.telefono),
          'direccion': new FormControl(data.direccion),
          'email': new FormControl(data.email)
        });
      });      
    }

  }

  operar(){
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.direccion = this.form.value['direccion'];
    paciente.telefono = this.form.value['telefono'];
    paciente.email = this.form.value['email'];

    if(this.edicion){
      //MODIFICAR
      //FORMA IDEAL TRABAJO SIN SUBSCRIBE DENTRO DE SUBSCRIBE

      this.pacienteService.modificar(paciente).pipe(switchMap(()=>{
        return this.pacienteService.listar();
      })).
      subscribe(data => {
        this.pacienteService.setPacienteCambio(data);
        this.pacienteService.setMensajeCambio('SE MODIFICÓ');
      });
      /*this.pacienteService.modificar(paciente).subscribe(() =>{
        this.pacienteService.listar().subscribe(data =>{
          this.pacienteService.pacienteCambio.next(data);
          this.pacienteService.mensajeCambio.next('SE MODIFICÓ');
        });
      });*/
    }else{
      //REGISTRAR
      this.pacienteService.registrar(paciente).subscribe(() =>{
      this.pacienteService.listar().subscribe(data =>{

        this.pacienteService.setPacienteCambio(data);
        this.pacienteService.setMensajeCambio('SE REGISTRÓ');
      });
      });
    }
    this.router.navigate(['/pages/paciente']);
  }

}
