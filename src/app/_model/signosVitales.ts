import { Paciente } from "./paciente";

export class SignosVitales{
    id : number;
    fecha: string;
    paciente: Paciente;
    pulso: string;
    temperatura: string;
    ritmo: number;
}