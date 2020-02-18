import { Doctor } from './doctor';
import { Error } from './error';

export class DoctorRespuesta {
    
    private doc: Doctor[];
    private err: Error;

    public doctores(): Doctor[] {
        return this.doc;
    }
    public setDoctores(doc: Doctor[]) {
        this.doc = doc;
    }

    public error(): Error {
        return this.err;
    }
    public setError(err: Error) {
        this.err = err;
    }
}