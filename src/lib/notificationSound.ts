export async function playNotificationSound() {
  // Try mp3 first
  try {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.7;
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
    const now = ctx.currentTime;

    // First ding
    playDing(ctx, now, 1200, 0.15);
    // Second ding (higher pitch, slight delay)
    playDing(ctx, now + 0.15, 1500, 0.12);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 500);
  } catch {
    // ignore sound errors
  }
}

function playDing(ctx: AudioContext, startTime: number, freq: number, duration: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.3, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}
