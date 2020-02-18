export class Clinica {
    private id: number;
    private nombre: string;
    private razonSocial: string;
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

    public getRazonSocial(): string {
        return this.razonSocial;
    }
    public setRazonSocial(razonSocial: string) {
        this.razonSocial = razonSocial;
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