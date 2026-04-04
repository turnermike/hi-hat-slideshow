import React, { useState } from 'react';
import { AlertCircle, CheckCircle, X, Info, Download } from 'lucide-react';

interface DebugLog {
  timestamp: string;
  level: 'info' | 'error' | 'success';
  message: string;
  details?: any;
}

export const ExportDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<DebugLog[]>([]);

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
    setLogs([]);
    addLog('info', 'Testing simple endpoint...');
    
    try {
      addLog('info', 'Sending request to /api/test...');
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      });

      addLog('info', `Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addLog('error', `Simple test failed: ${response.status} ${response.statusText}`, errorText);
        return;
      }

      const result = await response.json();
      addLog('success', 'Simple test successful!', result);
    } catch (error) {
      addLog('error', 'Simple test error', error);
    }
  };

  const testExport = async () => {
    setLogs([]);
    addLog('info', 'Starting video export test...');
    
    try {
      // Simple API test first
      addLog('info', 'Testing API endpoint connectivity...');
      const apiTest = await fetch('/api/export', {
        method: 'GET', // Simple GET test
      });
      addLog('success', `API GET test: ${apiTest.status} ${apiTest.statusText}`);
      
      // Test 2: Check project data structure
      addLog('info', 'Testing project data structure...');
      const testProject = {
        images: [{ id: 'test', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', order: 0 }],
        transitions: ['fade'],
        slideDurations: [2],
        transitionDurations: [0.5],
        captions: ['Test caption'],
        captionColors: ['#ffffff'],
        musicUrl: null,
        exportSettings: {
          resolution: '720p',
          format: 'mp4',
          quality: 'low',
          fps: 30
        },
        aspectRatio: '16:9'
      };
      addLog('success', 'Test project data created successfully');

      // Test 3: Try actual export
      addLog('info', 'Sending test export request...');
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: testProject })
      });

      addLog('info', `Export response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addLog('error', `Export failed: ${response.status} ${response.statusText}`, errorText);
        return;
      }

      const contentType = response.headers.get('content-type');
      const contentDisposition = response.headers.get('content-disposition');
      
      addLog('success', 'Export successful!', {
        contentType,
        contentDisposition,
        size: response.headers.get('content-length')
      });
    } catch (error) {
      addLog('error', 'Test failed', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogIcon = (level: DebugLog['level']) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogColor = (level: DebugLog['level']) => {
    switch (level) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <>
      {/* Always visible test */}
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs z-40">
        DEBUG PANEL ACTIVE
      </div>
      
      <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-96 max-h-96">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Export Debug Panel</h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={testSimpleEndpoint}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Test Simple API
              </button>
              <button
                onClick={testExport}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Test Export
              </button>
              <button
                onClick={clearLogs}
                className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Clear Logs
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {logs.length === 0 && (
                <div className="p-2 text-gray-500 text-sm">
                  No logs yet. Click "Test Simple API" first to verify Vercel functions work.
                </div>
              )}
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border ${getLogColor(log.level)}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getLogIcon(log.level)}
                    <span className="font-medium text-sm">{log.level.toUpperCase()}</span>
                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                  </div>
                  <div className="text-sm">{log.message}</div>
                  {log.details && (
                    <details className="mt-1">
                      <summary className="text-xs text-gray-600 cursor-pointer">Details</summary>
                      <pre className="text-xs bg-gray-50 p-2 mt-1 rounded overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};