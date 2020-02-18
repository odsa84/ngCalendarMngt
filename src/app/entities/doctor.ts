export class Doctor {

    private id: number;
    private nombre: string;
    private apellidos: string;
    private infoGeneral: string;
    private estado: boolean;

    public getId(): number {
        return this.id;
    }
    public setId(id: number) {
        this.id = id;
    }

    public getNombre(): string {
        return this.nombre;
    }
    public setNombre(nombre: string) {
        this.nombre = nombre;
    }

    public getApellidos(): string {
        return this.apellidos;
    }
    public setApellidos(apellidos: string) {
        this.apellidos = apellidos;
    }

    public getInfoGenral(): string {
        return this.infoGeneral;
    }
    public setInfoGeneral(infoGeneral: string) {
        this.infoGeneral = infoGeneral;
    }

    public getEstado(): boolean {
        return this.estado;
    }
    public setEstado(estado: boolean) {
        this.estado = estado;
    }
}