export async function playNotificationSound() {
  // Vibrate first (works on mobile without user gesture)
  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }

  // Try mp3 first
  try {
    const audio = new Audio("/notification.mp3");
    audio.volume = 1.0;
    await audio.play();
    return;
  } catch {
    // fallback below
  }

  // Synthesized pleasant "ding-ding" notification sound
  try {
    const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) return;

    const ctx = new AudioContextCtor();

    // Resume context if suspended (mobile autoplay policy)
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const now = ctx.currentTime;

    // Three-tone notification chime
    playDing(ctx, now, 880, 0.15);
    playDing(ctx, now + 0.18, 1100, 0.15);
    playDing(ctx, now + 0.36, 1320, 0.2);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 800);
  } catch {
    // ignore sound errors
  }
}

function playDing(ctx: AudioContext, startTime: number, freq: number, duration: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.4, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}
