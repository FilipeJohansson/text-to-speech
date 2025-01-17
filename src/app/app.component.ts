import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { TextBlock, TextBlockComponent } from "./text-block/text-block.component";
import { LucideAngularModule, Play, Download } from 'lucide-angular';
import { voices } from './voice-indicator/voice-indicator.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tts-root',
  imports: [LucideAngularModule, TextBlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly PlayIcon = Play;
  readonly DownloadIcon = Download;

  blocks: WritableSignal<TextBlock[]> = signal([
    {
      id: 0,
      content: '',
      speed: 0,
      pitch: 0,
      voice: voices[0],
      audioUrls: [
        { url: 'https://actions.google.com/sounds/v1/human_voices/pa_announcement_close.ogg?hl=pt-br', voiceColor: '#FF6B6B' },
      ],
    },
    {
      id: 1,
      content: '',
      speed: 0,
      pitch: 0,
      voice: voices[1],
      audioUrls: [
        { url: '', voiceColor: '#4ECDC4' },
        { url: '', voiceColor: '#FFA07A' },
      ],
    },
    {
      id: 2,
      content: '',
      speed: 0,
      pitch: 0,
      voice: voices[2],
      audioUrls: [],
    },
  ]);
  focusedBlockId: WritableSignal<number> = signal(0);

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
      voice: voices[0],
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
