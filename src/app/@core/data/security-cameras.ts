import { Observable } from 'rxjs';

export interface Camera {
  title: string;
  source: string;
  display?: boolean;
}

export abstract class SecurityCamerasData {
  abstract getCamerasData(): Observable<Camera[]>;
}
