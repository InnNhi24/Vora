/**
 * Input form for scenario details
 */

import { useState } from 'react';

interface ScenarioData {
  context: string;
  personaA: string;
  personaB: string;
  conflict: string;
}

interface ScenarioInputProps {
  onSubmit: (data: ScenarioData) => void;
  isLoading?: boolean;
}

export function ScenarioInput({ onSubmit, isLoading = false }: ScenarioInputProps) {
  const [formData, setFormData] = useState<ScenarioData>({
    context: '',
    personaA: '',
    personaB: '',
    conflict: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ScenarioData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Context
        </label>
        <textarea
          value={formData.context}
          onChange={(e) => handleChange('context', e.target.value)}
          placeholder="Describe the setting and situation..."
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Persona A
          </label>
          <input
            type="text"
            value={formData.personaA}
            onChange={(e) => handleChange('personaA', e.target.value)}
            placeholder="Character A description..."
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Persona B
          </label>
          <input
            type="text"
            value={formData.personaB}
            onChange={(e) => handleChange('personaB', e.target.value)}
            placeholder="Character B description..."
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Conflict
        </label>
        <textarea
          value={formData.conflict}
          onChange={(e) => handleChange('conflict', e.target.value)}
          placeholder="What's the central tension or goal?"
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
          rows={2}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Dialogue'}
      </button>
    </form>
  );
}
