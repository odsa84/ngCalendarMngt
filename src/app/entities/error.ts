export class Error {
    private cod: string;
    private mens: string;

    public codigo(): string {
        return this.cod;
    }
    public setCodigo(cod: string) {
        this.cod = cod;
    }

    public mensaje(): string {
        return this.mens;
    }
    public setMensaje(mens: string) {
        this.mens = mens;
    }
}