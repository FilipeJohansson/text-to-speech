import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, InputSignal, output, OutputEmitterRef, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { LucideAngularModule, X, Play, Loader2 } from 'lucide-angular';
import { AudioTrackComponent, AudioUrl } from '../audio-track/audio-track.component';
import { Voice, VoiceIndicatorComponent } from '../voice-indicator/voice-indicator.component';
import { TextToSpeechService } from '../text-to-speech.service';
import { finalize, Subscription, take } from 'rxjs';

export interface TextBlock {
  id: number
  content: string
  speed: number
  pitch: number
  voice: Voice
  audioUrls: AudioUrl[]
}

@Component({
  selector: 'tts-text-block',
  imports: [LucideAngularModule, AudioTrackComponent, VoiceIndicatorComponent],
  templateUrl: './text-block.component.html',
  styleUrl: './text-block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextBlockComponent {
  #textToSpeechService: TextToSpeechService = inject(TextToSpeechService);

  readonly XIcon = X;
  readonly PlayIcon = Play;
  readonly LoaderIcon = Loader2;

  block: InputSignal<TextBlock> = input.required<TextBlock>();
  voices: InputSignal<Voice[]> = input.required<Voice[]>();
  focus: InputSignal<boolean> = input.required<boolean>();

  canNotDelete: InputSignal<boolean | undefined> = input<boolean>();

  update: OutputEmitterRef<TextBlock> = output();
  enter: OutputEmitterRef<void> = output();
  backspace: OutputEmitterRef<void> = output();
  delete: OutputEmitterRef<void> = output();

  textareaRef: Signal<ElementRef<HTMLTextAreaElement> | undefined> = viewChild<ElementRef<HTMLTextAreaElement>>('textareaRef');

  isGenerating: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.focus() && this.textareaRef()) {
        this.textareaRef()?.nativeElement.focus();
      }
    });
  }

  public handleGenerate(): Subscription {
    if (!this.block().content) return new Subscription;

    this.isGenerating.set(true);

    const voiceColor: string = this.block().voice.color;

    return this.#textToSpeechService.synthesize$(this.block().content, this.block().voice.id)
      .pipe(
        take(1),
        finalize(() => this.isGenerating.set(false)),
      )
      .subscribe({
        next: (audioBlob: Blob) => {
          const newAudio: AudioUrl = { url: URL.createObjectURL(audioBlob), voiceColor };
          this.update.emit({ ...this.block(), audioUrls: [...this.block().audioUrls, newAudio] });
        },
        error: (e) => console.error('Error to syntesize text to speech', e),
      });
  }

  protected handleUpdateText(updateTextEvent: Event): void {
    const content: string = (updateTextEvent.target as HTMLTextAreaElement).value;
    this.update.emit({ ...this.block(), content });
  }

  protected handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      this.enter.emit();
    } else if (e.key === 'Backspace' && this.block().content === '') {
      e.preventDefault()
      this.backspace.emit();
    }
  }

  protected handleSpeedChange(changeEvent: Event): void {
    const speed: number = +(changeEvent.target as HTMLSelectElement).value;
    this.update.emit({ ...this.block(), speed });
  }

  protected handlePitchChange(changeEvent: Event): void {
    const pitch: number = +(changeEvent.target as HTMLSelectElement).value;
    this.update.emit({ ...this.block(), pitch });
  }

  protected handleSelectVoice(selectEvent: Event): void {
    const voiceId: string = (selectEvent.target as HTMLSelectElement).value;
    const selectedVoice = this.voices().find((v: Voice) => v.id === voiceId);
    if (selectedVoice) this.update.emit({ ...this.block(), voice: selectedVoice });
  }

  protected playAudio(url: string): void {
    const audio = new Audio(url);
    audio.play();
  }

  protected deleteAudio(index: number): void {
    this.update.emit({
      ...this.block(),
      audioUrls: this.block().audioUrls.filter((_, i) => i !== index),
    });
  }
}
