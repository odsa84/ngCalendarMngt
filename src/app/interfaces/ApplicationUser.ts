import { Usuario } from '../entities/usuario';
export interface ApplicationUser {
  token: string;
  expiresIn: Date;
  usuario: Usuario;
}