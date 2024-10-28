import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://api-techforbu-production.up.railway.app/auth'; 
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  private userInfo = new BehaviorSubject<any>(null); 


  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }



  getUserInfo(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/dataUser`, { headers }).pipe(
      map((data: any) => {
        // Almacenar datos del usuario
        const userData = {
          firstName: data.firstname || '',
          lastName: data.lastname || '',
          mail: data.mail,
          username: data.username,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        this.userSubject.next(userData); 
        return data
      })
    );
  }


  
  setUserInfo(user: any) {
    this.userInfo.next(user); // Almacena los datos del usuario en el observable
  }


// Método de login
login(credentials: { mail: string; password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
    map((response: any) => {
      // Almacenar el token en localStorage
      localStorage.setItem('token', response.token);

      // Asegúrate de que la estructura sea correcta aquí
      const userData = {
        firstName: response.user.firstname || '',
        lastName: response.user.lastname || '',
        mail: response.user.mail,
        username: response.user.username,
      };

      localStorage.setItem('user', JSON.stringify(userData));

      // Actualizar el BehaviorSubject con los nuevos datos del usuario
      this.userSubject.next(userData);

      return response;
    })
  );
}



  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any {
    return this.userSubject.value; // Retorna los detalles actuales del usuario
  }

  // Método de logout
  logout(): void {
    // Elimina el token y los detalles del usuario del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    console.log("LogOut");
    
  }
}
