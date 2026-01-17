import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// สร้าง Interface ตรงนี้เลยเพื่อให้ Clean
export interface Category { id: number; name: string; }
export interface Asset {
  id?: number;
  assetName: string;
  description?: string;
  serialNumber?: string;
  categoryId: number;
  category?: Category;
}

@Injectable({ providedIn: 'root' })
export class AssetService {

  private apiUrl = 'http://localhost:5050/api/assets';

  constructor(private http: HttpClient) {}

  getAssets(): Observable<Asset[]> { return this.http.get<Asset[]>(this.apiUrl); }
  getCategories(): Observable<Category[]> { return this.http.get<Category[]>(`${this.apiUrl}/categories`); }
  createAsset(asset: Asset): Observable<Asset> { return this.http.post<Asset>(this.apiUrl, asset); }
  updateAsset(id: number, asset: Asset): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}`, asset); }
  deleteAsset(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}