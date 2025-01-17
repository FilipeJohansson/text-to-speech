import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Voice {
  id: string;
  name: string;
  color: string;
  language: string;
}

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
