export function isSpeakerA(speaker: string): boolean {
  const normalizedSpeaker = normalizeSpeakerLabel(speaker);

  return (
    normalizedSpeaker === 'a' ||
    normalizedSpeaker === 'first' ||
    /^(character|speaker|persona|voice) a$/.test(normalizedSpeaker) ||
    /^character a\b/.test(normalizedSpeaker) ||
    /^speaker a\b/.test(normalizedSpeaker)
  );
}

function normalizeSpeakerLabel(speaker: string): string {
  return speaker.trim().toLowerCase().replace(/\s+/g, ' ');
}