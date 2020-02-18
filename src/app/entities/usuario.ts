export class Usuario {
    
    id: string;
    userName: string;
    email: string;
    password: string;
    telefono: string;

    public getId(): string {
        return this.id;
    }
    public setId(id: string) {
        this.id = id;
    }

    public getUserName(): string {
        return this.userName;
    }
    public setUserName(userName: string) {
        this.userName = userName;
    }

    public getEmail(): string {
        return this.email;
    }
    public setEmail(email: string) {
        this.email = email;
    }

    public getPassword(): string {
        return this.password;
    }
    public setPassword(password: string) {
        this.password = password;
    }

    public getTelefono(): string {
        return this.telefono;
    }
    public setTelefono(telefono: string) {
        this.telefono = telefono;
    }

}