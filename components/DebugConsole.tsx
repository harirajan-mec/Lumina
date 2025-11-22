import React, { useEffect, useState, useRef } from 'react';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'error' | 'ai-request' | 'ai-response';
  title: string;
  data?: any;
}

export const DebugConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLog = (e: Event) => {
      const customEvent = e as CustomEvent;
      setLogs(prev => [...prev, customEvent.detail]);
    };

    window.addEventListener('lumin-log', handleLog);
    
    // Initial log
    const initEvent = new CustomEvent('lumin-log', {
      detail: {
        id: 'init',
        timestamp: new Date(),
        type: 'info',
        title: 'Console Initialized',
        data: { version: '1.0.0', env: 'production' }
      }
    });
    window.dispatchEvent(initEvent);

    return () => window.removeEventListener('lumin-log', handleLog);
  }, []);

  useEffect(() => {
    if (isOpen) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const clearLogs = () => setLogs([]);

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400 border-red-900/50 bg-red-900/10';
      case 'ai-request': return 'text-yellow-300 border-yellow-900/50 bg-yellow-900/10';
      case 'ai-response': return 'text-green-300 border-green-900/50 bg-green-900/10';
      default: return 'text-blue-300 border-blue-900/50 bg-blue-900/10';
    }
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return `${d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${d.getMilliseconds().toString().padStart(3, '0')}`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 hover:scale-105 transition-all border border-gray-700 group"
        title="Open Debug Console"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:text-green-400 transition-colors">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-full max-w-lg flex flex-col shadow-2xl animate-fade-in-up">
      {/* Header */}
      <div className="bg-gray-900 text-gray-200 px-4 py-2 rounded-t-lg border border-gray-700 border-b-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-500">
             <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span className="font-mono text-sm font-bold">System Console</span>
          <span className="bg-gray-800 text-xs px-2 py-0.5 rounded text-gray-400">{logs.length} events</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearLogs} className="text-xs text-gray-500 hover:text-white hover:bg-gray-800 px-2 py-1 rounded transition-colors">
            Clear
          </button>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Logs Body */}
      <div className="bg-gray-950 h-80 overflow-y-auto p-4 font-mono text-xs rounded-b-lg border border-gray-700">
        {logs.length === 0 ? (
          <div className="text-gray-600 italic text-center mt-10">Waiting for system events...</div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div key={index} className={`border-l-2 pl-3 py-1 ${getStatusColor(log.type)}`}>
                <div className="flex justify-between opacity-70 mb-1">
                  <span className="uppercase font-bold tracking-wider text-[10px]">{log.type}</span>
                  <span>{formatTime(log.timestamp)}</span>
                </div>
                <div className="font-semibold text-gray-200 mb-1">{log.title}</div>
                {log.data && (
                  <pre className="bg-black/30 p-2 rounded overflow-x-auto text-gray-400 mt-1 max-h-24 custom-scrollbar">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};