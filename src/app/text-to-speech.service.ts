import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface WatsonTTSVoices {
  voices: WatsonTTSVoice[];
};

export interface WatsonTTSVoice {
  name: string;
  language: string;
  description: string;
  gender: 'male' | 'female';
  url: string;
  customizable: boolean;
  supported_features: { voice_transformation: boolean; custom_pronunciation: boolean };
};

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  #apiKey: string = '';
  #apiUrl: string = '';

  #http: HttpClient = inject(HttpClient);

  getVoices$(): Observable<WatsonTTSVoices> {
    const endpoint: string = `${this.#apiUrl}/v1/voices`;
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`apikey:${this.#apiKey}`)}`,
    });
  
    return this.#http.get<WatsonTTSVoices>(endpoint, { headers });
  }

  synthesize$(text: string, voice: string = 'en-US_AllisonV3Voice'): Observable<Blob> {
    const endpoint: string = `${this.#apiUrl}/v1/synthesize?voice=${voice}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'audio/mp3',
      Authorization: `Basic ${btoa(`apikey:${this.#apiKey}`)}`,
    });

    const body = {
      text,
    };

    return this.#http.post(endpoint, body, {
      headers,
      responseType: 'blob',
    });
  }
}
