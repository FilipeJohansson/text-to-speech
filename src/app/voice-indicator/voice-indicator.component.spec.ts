import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceIndicatorComponent } from './voice-indicator.component';

describe('VoiceIndicatorComponent', () => {
  let component: VoiceIndicatorComponent;
  let fixture: ComponentFixture<VoiceIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
