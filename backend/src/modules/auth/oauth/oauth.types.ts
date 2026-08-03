export interface GoogleAuthUrlResponse {
  url: string;
  state: string;
}

export interface GoogleCallbackDTO {
  code: string;
  state: string;
}