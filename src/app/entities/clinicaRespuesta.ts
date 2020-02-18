import { Clinica } from './clinica';
import { Error } from './error';

export class ClinicaRespuesta  {
    
    private clinic: Clinica[];
    private err: Error;

    public clinicas(): Clinica[] {
        return this.clinic;
    }
    public setClinicas(clinic: Clinica[]) {
        this.clinic = clinic;
    }

    public error(): Error {
        return this.err;
    }
    public setError(err: Error) {
        this.err = err;
    }
}