
import React from 'react';
import { flowData } from './data';
import FlowDiagram from './components/FlowDiagram';
import { processFlowData } from './services/flowProcessor';

const App: React.FC = () => {
  const { nodes, links } = processFlowData(flowData.flow);
  
  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
          {flowData.agent_name}
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          {flowData.description}
        </p>
      </header>
      <main className="w-full flex-grow flex flex-col items-center">
         <div className="w-full max-w-6xl h-[75vh] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <FlowDiagram nodes={nodes} links={links} startNodeId={flowData.flow.start} />
        </div>
      </main>
      <footer className="w-full max-w-6xl text-center mt-8 text-slate-500 text-sm">
        <p>Built with React, TypeScript, D3.js, and Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
