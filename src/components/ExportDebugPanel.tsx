import React, { useState } from 'react';
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

  const testEdgeRuntime = async () => {
    setLogs([]);
    addLog('info', 'Testing Edge Runtime endpoint...');
    
    try {
      addLog('info', 'Sending request to /api/edge...');
      const response = await fetch('/api/edge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'edge' })
      });

      addLog('info', `Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addLog('error', `Edge test failed: ${response.status} ${response.statusText}`, errorText);
        return;
      }

      const result = await response.json();
      addLog('success', 'Edge runtime test successful!', result);
    } catch (error) {
      addLog('error', 'Edge runtime test error', error);
    }
  };

  const testUltraSimple = async () => {
    setLogs([]);
    addLog('info', 'Testing ultra-simple endpoint...');
    
    try {
      addLog('info', 'Sending request to /api/simple...');
      const response = await fetch('/api/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'minimal' })
      });

      addLog('info', `Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addLog('error', `Ultra-simple test failed: ${response.status} ${response.statusText}`, errorText);
        return;
      }

      const result = await response.json();
      addLog('success', 'Ultra-simple test successful!', result);
    } catch (error) {
      addLog('error', 'Ultra-simple test error', error);
    }
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
      {/* Always visible indicator - more prominent */}
      <div className="fixed top-4 right-4 bg-red-500 text-white border-2 border-red-700 rounded-lg p-3 text-sm font-bold z-50 shadow-lg">
        🐛 DEBUG PANEL ACTIVE
      </div>
      
      {/* Debug panel trigger button - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-3 shadow-lg z-50 transition-colors"
        title="Open Debug Panel"
      >
        <Bug className="w-6 h-6" />
      </button>

      {/* Debug panel content */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 max-h-96 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">🔧 Export Debug Panel</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={testEdgeRuntime}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                🟠 Edge Runtime
              </button>
              <button
                onClick={testUltraSimple}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              >
                🟣 Ultra Simple
              </button>
              <button
                onClick={testSimpleEndpoint}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                🟢 Test Simple API
              </button>
              <button
                onClick={testExport}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                🔵 Test Export
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                🗑️ Clear Logs
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              {logs.length === 0 && (
                <div className="p-3 text-gray-600 text-sm bg-white rounded border border-gray-200">
                  📝 No logs yet. Start with "🟠 Edge Runtime" test.
                </div>
              )}
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getLogColor(log.level)}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getLogIcon(log.level)}
                    <span className="font-bold text-sm">{log.level.toUpperCase()}</span>
                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                  </div>
                  <div className="text-sm font-medium">{log.message}</div>
                  {log.details && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer hover:text-gray-700">📋 View Details</summary>
                      <pre className="text-xs bg-white p-2 mt-1 rounded border border-gray-300 overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};