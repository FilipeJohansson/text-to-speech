import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { TextBlock, TextBlockComponent } from "./text-block/text-block.component";
import { LucideAngularModule, Play, Download } from 'lucide-angular';
import { Voice } from './voice-indicator/voice-indicator.component';
import { TextToSpeechService, WatsonTTSVoice, WatsonTTSVoices } from './text-to-speech.service';
import { take } from 'rxjs';

@Component({
  selector: 'tts-root',
  imports: [LucideAngularModule, TextBlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  #textToSpeechService: TextToSpeechService = inject(TextToSpeechService);

  readonly PlayIcon = Play;
  readonly DownloadIcon = Download;

  voices: WritableSignal<Voice[]> = signal([]);
  blocks: WritableSignal<TextBlock[]> = signal([]);
  focusedBlockId: WritableSignal<number> = signal(0);

  constructor() {
    this.#textToSpeechService.getVoices$()
    .pipe(take(1))
    .subscribe({
      next: (watsonVoices: WatsonTTSVoices) => {
        const vs: Voice[] = watsonVoices.voices.map((wv: WatsonTTSVoice): Voice => {
          const color: string = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1,6)
          return {
            id: wv.name,
            name: wv.name,
            color,
            language: wv.language,
          };
        });
        this.voices.set(vs);

        this.blocks.set([
          {
            id: 0,
            content: '',
            speed: 0,
            pitch: 0,
            voice: this.voices()[0],
            audioUrls: [],
          },
        ]);
      },
      error: (e) => console.error('Error to get voices', e),
    });
  }

  protected handleGenerateAll(): void {
    throw new Error("Not implemented.");
  }

  protected handleExportAll(): void {
    throw new Error("Not implemented.");
  }

  protected handleUpdateBlock(updatedBlock: TextBlock): void {
    this.blocks.update((prev: TextBlock[]) => {
      return prev.map((b: TextBlock) => b.id === updatedBlock.id ? updatedBlock : b);
    });
  }

  protected handleEnterBlock(index: number): void {
    const newBlock = {
      id: this.blocks().length + 1,
      content: '',
      speed: 0,
      pitch: 0,
      voice: this.voices()[0],
      audioUrls: []
    };

    this.blocks.update((prev: TextBlock[]) => {
      const newBlocks = [...prev];
      
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    this.focusedBlockId.set(newBlock.id);
  }

  protected handleBackspace(index: number): void {
    if (index === 0) return // Prevent deleting the first block

    this.blocks.update((prev: TextBlock[]) => {
      const newBlocks = [...prev];
      newBlocks.splice(index, 1);
      return newBlocks;
    });

    this.focusedBlockId.set(this.blocks()[index - 1].id);
  }

  protected handleDeleteBlock(id: number): void {
    this.blocks.update((prev: TextBlock[]) => {
      const updatedBlocks = prev.filter((block: TextBlock) => block.id !== id);
      return updatedBlocks.length > 0 ? updatedBlocks : prev;
    });
  }
}
