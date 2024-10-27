import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plant } from '../model/plant';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private apiUrl = 'https://api-techforbu-production.up.railway.app/plants';

  constructor(private http: HttpClient) { }

  getAllPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(this.apiUrl);
  }

  getPlantById(id: number): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/${id}`);
  }

  createPlant(plant: Plant): Observable<Plant> {
    return this.http.post<Plant>(this.apiUrl, plant);
  }

  updatePlant(plant: Plant): Observable<Plant> {
    return this.http.put<Plant>(`${this.apiUrl}/${plant.id}`, plant);
}

  

  deletePlant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}