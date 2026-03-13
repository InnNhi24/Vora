/**
 * Export utilities for PDF and audio
 */

import { jsPDF } from 'jspdf';
import { DialogueStructure } from '../types/dialogue';
import { isSpeakerA } from './speaker';

/**
 * Exports dialogue as formatted PDF
 */
export async function exportToPDF(dialogue: DialogueStructure): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(99, 102, 241); // Indigo
  doc.text('VORA Dialogue', margin, y);
  y += 15;

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);
  y += 5;
  doc.text(`Iterations: ${dialogue.metadata.iterations}`, margin, y);
  y += 5;
  if (dialogue.metadata.scenario) {
    const scenarioLines = doc.splitTextToSize(`Scenario: ${dialogue.metadata.scenario}`, pageWidth - 2 * margin);
    doc.text(scenarioLines, margin, y);
    y += scenarioLines.length * 5 + 10;
  } else {
    y += 10;
  }

  // Dialogue
  doc.setTextColor(0, 0, 0);
  
  dialogue.dialogue.forEach((turn) => {
    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    // Speaker name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const speakerColor = isSpeakerA(turn.speaker) ? [99, 102, 241] : [139, 92, 246];
    doc.setTextColor(speakerColor[0], speakerColor[1], speakerColor[2]);
    doc.text(`${turn.speaker}${turn.emotion ? ` (${turn.emotion})` : ''}`, margin, y);
    y += 7;

    // Dialogue text
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(turn.text, pageWidth - 2 * margin);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 10;
  });

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} • Created with VORA`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`vora-dialogue-${Date.now()}.pdf`);
}

/**
 * Audio export (not yet implemented)
 */
export async function exportToAudio(dialogue: DialogueStructure): Promise<void> {
  void dialogue;
  throw new Error('Audio export is not supported yet. Use Voice Playback in VORA for now.');
}
