export class AudioController {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private initCtx() {
     if (!this.ctx) return;
     if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (!this.ctx || !this.enabled || this.isMuted) return;
    this.initCtx();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playMove() {
    this.playTone(300, 'square', 0.05, 0.05);
  }

  playRotate() {
    this.playTone(400, 'triangle', 0.1, 0.05);
  }

  playDrop() {
    this.playTone(200, 'sawtooth', 0.1, 0.05);
  }

  playCorrect() {
    if (!this.ctx || this.isMuted) return;
    this.initCtx();
    const now = this.ctx.currentTime;
    this.playToneAt(523.25, now); // C5
    this.playToneAt(659.25, now + 0.1); // E5
    this.playToneAt(783.99, now + 0.2); // G5
  }

  playError() {
    this.playTone(100, 'sawtooth', 0.4, 0.1);
  }

  playClear() {
    if (!this.ctx || this.isMuted) return;
    this.initCtx();
    const now = this.ctx.currentTime;
    this.playToneAt(880, now);
    this.playToneAt(1760, now + 0.1);
  }

  private playToneAt(freq: number, time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  // --- BGM Sequencer (Cute Version) ---
  
  startMusic() {
    if (!this.ctx || this.bgmInterval) return;
    this.initCtx();
    
    // A cuter, bouncier melody
    const sequence = [
      { f: 523.25, d: 0.1 }, { f: 0, d: 0.1 }, { f: 659.25, d: 0.1 }, { f: 0, d: 0.1 }, // C E
      { f: 783.99, d: 0.1 }, { f: 0, d: 0.1 }, { f: 1046.50, d: 0.1 }, { f: 0, d: 0.1 }, // G C
      { f: 783.99, d: 0.1 }, { f: 0, d: 0.1 }, { f: 659.25, d: 0.1 }, { f: 0, d: 0.1 }, // G E
      { f: 523.25, d: 0.2 }, { f: 0, d: 0.2 }, // C
    ];
    
    let step = 0;
    const tempo = 200; 

    this.playStep(sequence[0]);
    step = 1;

    this.bgmInterval = window.setInterval(() => {
        if (this.isMuted) return;
        const note = sequence[step % sequence.length];
        if (note.f > 0) this.playStep(note);
        step++;
    }, tempo);
  }

  stopMusic() {
    if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
    }
  }

  toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
          this.stopMusic();
      } 
      return this.isMuted;
  }

  private playStep(note: { f: number, d: number }) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle'; // Triangle is "cuter" than sine
      osc.frequency.setValueAtTime(note.f, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + note.d);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + note.d);
  }
}

export const audioController = new AudioController();
