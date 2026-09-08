import { useState, useEffect, useRef } from "react";

interface Mix {
  id: string;
  title: string;
  subtitle: string;
  bpm: number;
  icon: string;
  platform: string;
  platformIcon: string;
  url: string;
  color: string;
}

const MIXES: Mix[] = [
  {
    id: "hotmix",
    title: "HotMix",
    subtitle: "High-BPM Club Anthems",
    bpm: 128,
    icon: "headphones",
    platform: "YouTube",
    platformIcon: "smart_display",
    url: "https://m.youtube.com/watch?v=P1xBohYyMpU&ra=m",
    color: "var(--color-secondary-container)",
  },
  {
    id: "tropicalmix",
    title: "TropicalMix",
    subtitle: "Smooth Latin Grooves",
    bpm: 96,
    icon: "graphic_eq",
    platform: "Podcasts",
    platformIcon: "podcasts",
    url: "https://podcasts.apple.com/ni/podcast/adn-radio-nicaragua/id1453976591?i=1000578476205",
    color: "var(--color-secondary-container)",
  },
];

export default function AudioPlayer() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorIntervalRef = useRef<number | null>(null);
  
  // Real-time wave animation heights (8 bars per mix)
  const [waveHeights, setWaveHeights] = useState<{ [key: string]: number[] }>({
    hotmix: [30, 50, 40, 70, 90, 60, 45, 30],
    tropicalmix: [40, 25, 65, 50, 30, 80, 45, 20],
  });

  // Dynamic animation for playing waves
  useEffect(() => {
    let animId: number;
    const updateWaves = () => {
      if (playingId) {
        setWaveHeights((prev) => {
          const current = prev[playingId];
          const next = current.map((h) => {
            // Randomly oscillate heights, keeping within 20% to 100%
            const change = (Math.random() - 0.5) * 30;
            return Math.max(15, Math.min(100, h + change));
          });
          return {
            ...prev,
            [playingId]: next,
          };
        });
      }
      animId = requestAnimationFrame(updateWaves);
    };
    animId = requestAnimationFrame(updateWaves);
    return () => cancelAnimationFrame(animId);
  }, [playingId]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (oscillatorIntervalRef.current) {
      window.clearInterval(oscillatorIntervalRef.current);
      oscillatorIntervalRef.current = null;
    }
    // We don't close the audio context, just stop scheduling sounds
  };

  const playSynthesizedBeat = (id: string, bpm: number) => {
    try {
      // Initialize AudioContext lazily
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      stopAudio();

      const beatDuration = 60 / bpm; // Time per beat
      let step = 0;

      const triggerSynth = () => {
        const time = ctx.currentTime;

        // Step 1: Bass Drum (Kick)
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);

        // Sweeping pitch for kick drum
        kickOsc.frequency.setValueAtTime(150, time);
        kickOsc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);

        // Decaying volume
        kickGain.gain.setValueAtTime(1.0, time);
        kickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        kickOsc.start(time);
        kickOsc.stop(time + 0.3);

        // Step 2: Latin Cowbell or Snare-like clap on selected steps (Reggaeton dembow or house groove)
        if (id === "hotmix") {
          // House offbeat hi-hat (steps 1, 3, 5, 7 in a 8-step measure, or step%2 !== 0)
          if (step % 2 !== 0) {
            triggerHihat(ctx, time);
          }
        } else {
          // Reggaeton Dembow rhythm clap on steps 3 and 7, syncopated step on 6
          // Dembow beat relies on: Kick on 1, 5; Snare/Clap on 4, 7, 8
          if (step === 3 || step === 6) {
            triggerClap(ctx, time);
          }
        }

        step = (step + 1) % 8;
      };

      // Trigger first beat immediately
      triggerSynth();

      // Schedule subsequent beats
      const intervalMs = (beatDuration / 2) * 1000; // 8th notes
      oscillatorIntervalRef.current = window.setInterval(triggerSynth, intervalMs);

    } catch (e) {
      console.error("Failed to generate synthesized preview:", e);
    }
  };

  const triggerHihat = (ctx: AudioContext, time: number) => {
    // Generate white noise for hi-hat
    const bufferSize = ctx.sampleRate * 0.05; // 50ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Highpass filter for sizzly hat sound
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.15, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start(time);
    noiseNode.stop(time + 0.05);
  };

  const triggerClap = (ctx: AudioContext, time: number) => {
    // Bandpass filtered noise decaying rapidly to mimic rimshot/clap
    const bufferSize = ctx.sampleRate * 0.12; // 120ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    filter.Q.value = 3.0;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.4, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseNode.start(time);
    noiseNode.stop(time + 0.12);
  };

  const handlePlayToggle = (id: string, bpm: number) => {
    if (playingId === id) {
      stopAudio();
      setPlayingId(null);
    } else {
      setPlayingId(id);
      playSynthesizedBeat(id, bpm);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-lg">
      {MIXES.map((mix) => {
        const isCurrent = playingId === mix.id;
        const bars = waveHeights[mix.id];

        return (
          <div
            key={mix.id}
            onClick={() => handlePlayToggle(mix.id, mix.bpm)}
            className={`bg-surface-container p-8 rounded-2xl border ${
              isCurrent ? "border-secondary-container" : "border-white/5"
            } card-hover cursor-pointer relative overflow-hidden group select-none`}
            id={`mix-card-${mix.id}`}
          >
            {/* Visual pulse background when playing */}
            {isCurrent && (
              <div className="absolute inset-0 bg-secondary-container/5 pointer-events-none animate-pulse" />
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                  {mix.title}
                  {isCurrent && (
                    <span className="text-[12px] bg-secondary-container/20 text-secondary-container px-2 py-1 rounded font-mono font-bold animate-pulse">
                      PLAYING • {mix.bpm} BPM
                    </span>
                  )}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  {mix.subtitle}
                </p>
              </div>
              <span
                className={`material-symbols-outlined text-4xl transition-colors duration-300 ${
                  isCurrent ? "text-secondary-container animate-spin-slow" : "text-primary"
                }`}
              >
                {isCurrent ? "sync" : mix.icon}
              </span>
            </div>

            {/* Interactive Audio Waveform */}
            <div className="h-16 flex items-end gap-1 mb-6 group-hover:opacity-100 transition-opacity">
              {bars.map((height, i) => (
                <div
                  key={i}
                  className="w-full rounded-t transition-all duration-150"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isCurrent ? "var(--color-secondary-container)" : "rgba(0, 244, 254, 0.3)",
                    boxShadow: isCurrent ? "0 0 10px rgba(0, 244, 254, 0.4)" : "none",
                  }}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
              {/* Play / Pause Local Synth Preview */}
              <button
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 border ${
                  isCurrent 
                    ? "bg-primary/20 text-primary border-primary/30 font-bold" 
                    : "bg-white/5 text-white/60 border-white/5 hover:text-white hover:border-white/20"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayToggle(mix.id, mix.bpm);
                }}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isCurrent ? "pause" : "play_arrow"}
                </span>
                {isCurrent ? "PAUSE PREVIEW" : "PLAY PREVIEW"}
              </button>
              
              {/* External Streaming Link - Minimalist */}
              <a
                href={mix.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] tracking-widest font-mono uppercase text-on-surface-variant hover:text-primary hover:border-primary/40 hover:bg-white/5 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {mix.platformIcon}
                </span>
                <span>{mix.platform}</span>
                <span className="material-symbols-outlined text-[10px] opacity-60">
                  north_east
                </span>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
