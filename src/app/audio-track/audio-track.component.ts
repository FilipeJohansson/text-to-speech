import { ChangeDetectionStrategy, Component, effect, ElementRef, input, InputSignal, output, OutputEmitterRef, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { Download, LucideAngularModule, Pause, Play, Trash2 } from 'lucide-angular';

export interface AudioUrl { name:string, url: string, voiceColor: string };

@Component({
  selector: 'tts-audio-track',
  imports: [LucideAngularModule],
  templateUrl: './audio-track.component.html',
  styleUrl: './audio-track.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioTrackComponent {
  readonly PlayIcon = Play;
  readonly PauseIcon = Pause;
  readonly DownloadIcon = Download;
  readonly TrashIcon = Trash2;

  audio: InputSignal<AudioUrl> = input.required<AudioUrl>();

  play: OutputEmitterRef<void> = output();
  download: OutputEmitterRef<void> = output();
  delete: OutputEmitterRef<void> = output();

  audioRef: Signal<ElementRef<HTMLAudioElement> | undefined> = viewChild('audioRef');

  isPlaying: WritableSignal<boolean> = signal(false);
  currentTime: WritableSignal<number> = signal(0);
  duration: WritableSignal<number> = signal(0);

  constructor() {
    effect(() => {
      if (this.audioRef()?.nativeElement) {
        this.audioRef()?.nativeElement.addEventListener('ended', () => this.isPlaying.set(false));
        return () => {
          this.audioRef()?.nativeElement.removeEventListener('ended', () => this.isPlaying.set(false));
        }
      }
      return false;
    });
  }

  protected togglePlayPause(): void {
    if (this.audioRef()?.nativeElement) {
      if (this.isPlaying()) {
        this.audioRef()?.nativeElement.pause();
      } else {
        this.audioRef()?.nativeElement.play();
      }
      this.isPlaying.set(!this.isPlaying());
    }
  }

  protected handleTimeUpdate(timeUpdateEvent: Event): void {
    if (this.audioRef()?.nativeElement) {
      const currentTime: number | undefined = this.audioRef()?.nativeElement.currentTime;
      this.currentTime.set(currentTime ?? 0);
    }
  }

  protected handleLoadedMetadata(loadedMetadataEvent: Event): void {
    if (this.audioRef()?.nativeElement) {
      const duration: number | undefined = this.audioRef()?.nativeElement.duration;
      this.duration.set(duration ?? 0);
    }
  }
}
