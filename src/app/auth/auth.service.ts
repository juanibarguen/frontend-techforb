import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL base de la API de autenticación
  private apiUrl = 'https://api-techforbu-production.up.railway.app/auth'; 
  
  // BehaviorSubject para almacenar y observar los datos del usuario
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  // Almacena información adicional del usuario
  private userInfo = new BehaviorSubject<any>(null); 

  constructor(private http: HttpClient) {
    // Inicializa `userSubject` con los datos del usuario guardados en localStorage 
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  // Obtiene la información del usuario de la API
  getUserInfo(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get(`${this.apiUrl}/dataUser`, { headers }).pipe(
      map((data: any) => {
        // Almacena los datos obtenidos del usuario en localStorage
        const userData = {
          firstName: data.firstname || '',
          lastName: data.lastname || '',
          mail: data.mail,
          username: data.username,
        };
        // Actualiza localStorage y el BehaviorSubject
        localStorage.setItem('user', JSON.stringify(userData));
        this.userSubject.next(userData); 
        return data;
      })
    );
  }

  // Configura y almacena información adicional del usuario en `userInfo`
  setUserInfo(user: any) {
    this.userInfo.next(user); 
  }

  // Método para iniciar sesión
  login(credentials: { mail: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        // Almacena el token de autenticación en localStorage
        localStorage.setItem('token', response.token);

        // Prepara y almacena los datos del usuario obtenidos de la respuesta
        const userData = {
          firstName: response.user.firstname || '',
          lastName: response.user.lastname || '',
          mail: response.user.mail,
          username: response.user.username,
        };

        localStorage.setItem('user', JSON.stringify(userData));

        // Actualiza el BehaviorSubject con los nuevos datos del usuario
        this.userSubject.next(userData);

        return response;
      })
    );
  }

  // Almacena el token en localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtiene el token de localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verifica si el usuario está autenticado a travez del token en localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtiene los datos del usuario actual
  getUser(): any {
    return this.userSubject.value; 
  }

  // Método para cerrar sesión
  logout(): void {
    // Elimina el token y los datos del usuario de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null); // Resetea los datos del usuario en el BehaviorSubject
    console.log("LogOut");
  }
}
