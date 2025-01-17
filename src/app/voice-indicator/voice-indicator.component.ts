import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Voice {
  id: string;
  name: string;
  color: string;
  language: string;
}

export const voices: Voice[] = [
  { id: 'filipe', name: 'Filipe', color: '#FF6B6B', language: 'pt-br' },
  { id: 'anabela', name: 'Anabela', color: '#4ECDC4', language: 'pt-pt' },
  { id: 'diogo', name: 'Diogo', color: '#45B7D1', language: 'pt-pt' },
  { id: 'maxwell', name: 'Maxwell', color: '#FFA07A', language: 'en-us' },
];

@Component({
  selector: 'tts-voice-indicator',
  imports: [],
  templateUrl: './voice-indicator.component.html',
  styleUrl: './voice-indicator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoiceIndicatorComponent {
  voice = input.required<Voice>();
}
