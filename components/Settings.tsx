
import React, { useState, useEffect } from 'react';
import { AppSettings, ChatSession } from '../types';
import { DEFAULT_SYSTEM_INSTRUCTION, testConnection } from '../services/geminiService';

const SETTINGS_KEY = 'neville_app_settings';
const SESSIONS_KEY = 'neville_chat_sessions';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    temperature: 0.7,
    systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
    apiKey: ''
  });
  const [saveStatus, setSaveStatus] = useState('');
  const [testStatus, setTestStatus] = useState<{ loading: boolean; message: string; success?: boolean }>({
    loading: false,
    message: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Auto-save whenever settings change
  useEffect(() => {
    if (settings.apiKey || settings.temperature !== 0.7) { // Avoid saving empty initial state if not necessary, but better save everything
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaveStatus('Wszystkie zmiany zostały zapisane!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleTestConnection = async () => {
    if (!settings.apiKey) {
      setTestStatus({ loading: false, message: 'Wpisz klucz API przed testem.', success: false });
      return;
    }

    setTestStatus({ loading: true, message: 'Testowanie połączenia...' });
    const result = await testConnection(settings.apiKey);
    setTestStatus({ loading: false, message: result.message, success: result.success });
  };

  const handleExport = () => {
    const sessions = localStorage.getItem(SESSIONS_KEY);
    const blob = new Blob([sessions || '[]'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neville-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        JSON.parse(content); // Validate JSON
        localStorage.setItem(SESSIONS_KEY, content);
        alert('Historia zaimportowana pomyślnie! Odśwież stronę mentora.');
      } catch (err) {
        alert('Błąd podczas importowania pliku.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSettings = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne parametry AI? (Klucz API zostanie zachowany)')) {
      const defaults = {
        ...settings,
        temperature: 0.7,
        systemInstruction: DEFAULT_SYSTEM_INSTRUCTION
      };
      setSettings(defaults);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl pt-10 pb-20">
      <h2 className="text-4xl font-bold text-amber-200 serif mb-8">Ustawienia</h2>

      <div className="space-y-10">
        {/* AI Config */}
        <section className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-2xl font-bold text-white serif">Konfiguracja Mentora</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-amber-100 font-medium">Klucz API Gemini</label>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${settings.apiKey ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">{settings.apiKey ? 'Skonfigurowano' : 'Brak klucza'}</span>
                </div>
              </div>
              <input
                type="password"
                placeholder="Wklej swój klucz API tutaj..."
                value={settings.apiKey || ''}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-amber-500 transition"
              />
              <p className="text-[10px] text-gray-500">Twój klucz jest zapisywany wyłącznie lokalnie w pamięci trwałej urządzenia.</p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleTestConnection}
                disabled={testStatus.loading}
                className={`w-full py-2 rounded-lg border transition-all text-sm font-bold ${testStatus.success === true ? 'border-green-500/50 text-green-400 bg-green-500/5' :
                  testStatus.success === false ? 'border-red-500/50 text-red-400 bg-red-500/5' :
                    'border-amber-500/30 text-amber-200 hover:bg-amber-500/10'
                  }`}
              >
                {testStatus.loading ? 'Sprawdzanie...' : 'Testuj połączenie'}
              </button>
              {testStatus.message && (
                <p className={`text-center text-xs ${testStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                  {testStatus.message}
                </p>
              )}
            </div>
          </div>

          <div className="h-[1px] bg-white/5 w-full"></div>

          <div className="space-y-2">
            <label className="block text-amber-100 font-medium">Temperatura (Kreatywność: {settings.temperature})</label>
            <input
              type="range"
              min="0" max="1" step="0.1"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Bardziej logiczny</span>
              <span>Bardziej kreatywny</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-amber-100 font-medium">Instrukcja Systemowa (Osobowość AI)</label>
            <textarea
              rows={8}
              value={settings.systemInstruction}
              onChange={(e) => setSettings({ ...settings, systemInstruction: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg"
            >
              Zapisz Ustawienia
            </button>
            <button
              onClick={handleResetSettings}
              className="text-gray-400 hover:text-white transition text-sm"
            >
              Przywróć domyślne
            </button>
          </div>
          {saveStatus && <p className="text-green-400 animate-pulse font-medium">{saveStatus}</p>}
        </section>

        {/* History Management */}
        <section className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-2xl font-bold text-white serif">Zarządzanie Historią</h3>
          <p className="text-gray-400">Eksportuj swoje rozmowy do pliku JSON lub zaimportuj je z innego urządzenia.</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExport}
              className="flex-1 bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-500/30 py-4 px-6 rounded-xl transition flex items-center justify-center space-x-2"
            >
              <span>📥</span> <span>Eksportuj Historię</span>
            </button>

            <label className="flex-1 bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-500/30 py-4 px-6 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer text-center">
              <span>📤</span> <span>Importuj Historię</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
