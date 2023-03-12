export interface IProduct {
  id: string;
  name: string;
  price: number;
}

export interface IProductId {
  id: string;
}

import { Observable } from 'rxjs';

export interface IProductGrpcService {
  getProduct(data: IProductId): Observable<IProduct>;
}
