import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plant } from '../model/plant';

@Injectable({
  providedIn: 'root'
})

export class PlantService {
  private apiUrl = 'https://api-techforbu-production.up.railway.app/plants'; // URL base de la API para las plantas

  constructor(private http: HttpClient) { }

  // Método para obtener la lista de todas las plantas
  getAllPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(this.apiUrl); // Realiza una solicitud GET al back end
  }

  // Método para obtener una planta específica por su ID
  getPlantById(id: number): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/${id}`); // Realiza una solicitud GET con el ID de la planta
  }

  // Método para crear una nueva planta
  createPlant(plant: Plant): Observable<Plant> {
    return this.http.post<Plant>(this.apiUrl, plant); // Realiza una solicitud POST con los datos de la planta
  }

  // Método para actualizar los datos de una planta existente
  updatePlant(plant: Plant): Observable<Plant> {
    return this.http.put<Plant>(`${this.apiUrl}/${plant.id}`, plant); // Realiza una solicitud PUT con el ID y los datos actualizados de la planta
  }

  // Método para eliminar una planta por su ID
  deletePlant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Realiza una solicitud DELETE con el ID de la planta
  }
}

