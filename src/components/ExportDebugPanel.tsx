import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X, Info, Download, Bug } from 'lucide-react';

interface DebugLog {
  timestamp: string;
  level: 'info' | 'error' | 'success';
  message: string;
  details?: any;
}

export const ExportDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    // Check for debug parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get('debug');
    setIsDebugMode(debugParam === '1');
  }, []);

  // Don't render anything if not in debug mode
  if (!isDebugMode) {
    return null;
  }

  console.log('ExportDebugPanel rendered, isOpen:', isOpen);
  console.log('Current logs count:', logs.length);

  const addLog = (level: DebugLog['level'], message: string, details?: any) => {
    console.log('Adding log:', level, message);
    const newLog: DebugLog = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      details
    };
    setLogs(prev => {
      console.log('Updating logs, new count:', prev.length + 1);
      return [...prev, newLog];
    });
  };

  const testSimpleEndpoint = async () => {
    addLog('info', 'Testing simple API endpoint...');
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      addLog('success', `Simple API test successful!`, data);
    } catch (error) {
      addLog('error', `Simple API test failed: ${error}`);
    }
  };

  const testUltraSimple = async () => {
    addLog('info', 'Testing ultra-simple API endpoint...');
    try {
      const response = await fetch('/api/simple');
      const data = await response.json();
      addLog('success', `Ultra-simple API test successful!`, data);
    } catch (error) {
      addLog('error', `Ultra-simple API test failed: ${error}`);
    }
  };

  const testEdgeRuntime = async () => {
    addLog('info', 'Testing Edge Runtime endpoint...');
    try {
      const response = await fetch('/api/edge');
      const data = await response.json();
      addLog('success', `Edge Runtime test successful!`, data);
    } catch (error) {
      addLog('error', `Edge Runtime test failed: ${error}`);
    }
  };

  const testHybridExport = async () => {
    addLog('info', 'Testing hybrid export (Edge Runtime + External Service)...');
    addLog('info', 'Creating test project data...');
    
    const testProject = {
      images: [
        { id: 'test1', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', order: 0 }
      ],
      transitions: ['fade'],
      slideDurations: [3],
      transitionDurations: [1],
      captions: ['Test Caption'],
      captionColors: ['#ffffff'],
      musicUrl: null,
      exportSettings: {
        resolution: '720p',
        format: 'mp4',
        quality: 'medium',
        fps: 30
      },
      aspectRatio: '16:9'
    };

    addLog('info', 'Sending request to /api/export...');
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: testProject })
      });

      addLog('info', `Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        addLog('error', `Export failed: ${errorData.error || 'Unknown error'}`, errorData);
        return;
      }

      const contentType = response.headers.get('content-type');
      const contentDisposition = response.headers.get('content-disposition');
      const size = response.headers.get('content-length');

      addLog('success', 'Hybrid export successful!', {
        contentType,
        contentDisposition,
        size
      });
    } catch (error) {
      addLog('error', `Hybrid export failed: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('info', 'Debug logs cleared');
  };

  return (
    <>
      {/* Debug indicator */}
      <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
        <Bug className="w-4 h-4" />
        DEBUG PANEL ACTIVE
      </div>

      {/* Debug panel */}
      <div className={`fixed bottom-0 right-0 w-96 h-96 bg-gray-900 text-white shadow-2xl transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* Header */}
        <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Debug Panel
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Buttons */}
          <div className="p-4 border-b border-gray-700 space-y-2">
            <button
              onClick={testHybridExport}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
            >
              🚀 Hybrid Export
            </button>
            <button
              onClick={testEdgeRuntime}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
            >
              🟠 Edge Runtime
            </button>
            <button
              onClick={clearLogs}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
            >
              🗑️ Clear Logs
            </button>
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">
                No debug logs yet. Run a test to see logs.
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`text-sm p-2 rounded ${log.level === 'error' ? 'bg-red-900/50 border border-red-700' : log.level === 'success' ? 'bg-green-900/50 border border-green-700' : 'bg-blue-900/50 border border-blue-700'}`}>
                  <div className="flex items-start gap-2">
                    {log.level === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    ) : log.level === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{log.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{log.timestamp}</div>
                      {log.details && (
                        <div className="mt-2 text-xs bg-black/30 p-2 rounded font-mono">
                          <strong>📋 View Details</strong>
                          <pre className="whitespace-pre-wrap mt-1">{JSON.stringify(log.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-40 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Bug className="w-6 h-6" />
      </button>
    </>
  );
};