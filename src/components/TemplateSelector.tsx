import React from 'react';
import { useProjectStore } from '@/stores/projectStore';
import type { Template } from '@/types';

const TEMPLATES: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    bgColor: '#0A0A0F',
    textColor: '#F9FAFB',
    textFont: 'sans',
    textShadow: false,
  },
  {
    id: 'bold',
    name: 'Bold',
    bgColor: '#1A1A24',
    textColor: '#6366F1',
    textFont: 'sans',
    textShadow: true,
    accentColor: '#8B5CF6',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    bgColor: '#000000',
    textColor: '#F9FAFB',
    textFont: 'serif',
    textShadow: true,
  },
];

export const TemplateSelector: React.FC = () => {
  const selectedTemplate = useProjectStore((state) => state.selectedTemplate);
  const setTemplate = useProjectStore((state) => state.setTemplate);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-text-primary font-medium">Template</h3>
      <div className="grid grid-cols-3 gap-2">
        {TEMPLATES.map((template) => (
          <button key={template.id} onClick={() => setTemplate(template)} className={`p-3 rounded-lg border-2 transition-colors ${selectedTemplate?.id === template.id ? 'border-primary' : 'border-dark-border'}`}>
            <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: template.bgColor, borderWidth: '1px', borderColor: template.accentColor || template.textColor }} />
            <p className="text-text-primary text-sm font-medium">{template.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
