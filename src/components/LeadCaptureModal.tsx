import React, { useState } from 'react';
import { CanvasNode, CanvasIntegration } from '../types';
import * as Icons from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeComponents: CanvasNode[];
  activeIntegrations: CanvasIntegration[];
}

export default function LeadCaptureModal({ isOpen, onClose, activeComponents, activeIntegrations }: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('DESIGN');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Simulate sending lead data and current stage topology to marketing pipeline
    const leadPayload = {
      name,
      company,
      email,
      interest,
      notes,
      architecture: {
        components: activeComponents.map(c => ({ name: c.name, pillar: c.pillar })),
        integrations: activeIntegrations.map(i => ({ source: i.sourceId, target: i.targetId, protocol: i.protocol }))
      },
      submittedAt: new Date().toISOString()
    };

    console.log("Saving Event Lead:", leadPayload);

    // Save lead to local storage for local persistence
    const savedLeads = JSON.parse(localStorage.getItem('octave_event_leads') || '[]');
    savedLeads.push(leadPayload);
    localStorage.setItem('octave_event_leads', JSON.stringify(savedLeads));

    setIsSubmitted(true);
  };

  return (
    <div id="lead-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div 
        id="lead-modal-content"
        className="relative w-full max-w-lg bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-neutral-900/40">
          <div className="flex items-center gap-2">
            <Icons.Share2 className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-bold tracking-wider text-white uppercase">Request Solution Follow-up</h3>
              <p className="text-[9px] text-neutral-500 font-mono tracking-widest mt-0.5">[ EVENT BOOTH PORTFOLIO SUMMARY ]</p>
            </div>
          </div>
          <button
            id="btn-close-lead-modal"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {!isSubmitted ? (
            <form id="lead-form" onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                Submit your contact details and we will send a customized technical synopsis of the architecture you built on the stage, along with brochures of the selected systems.
              </p>

              {/* Summary of what they designed */}
              <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 space-y-2 text-xs">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">[ YOUR DESIGNED ARCHITECTURE SUMMARY ]</span>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Selected Components:</span>
                  <span className="font-bold text-sky-400">{activeComponents.length} systems</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Active Integrations:</span>
                  <span className="font-bold text-emerald-400">{activeIntegrations.length} data links</span>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Full Name *</label>
                  <input
                    id="lead-input-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Company Name</label>
                  <input
                    id="lead-input-company"
                    type="text"
                    placeholder="Enter company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Email Address *</label>
                <input
                  id="lead-input-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Primary Area of Interest</label>
                <select
                  id="lead-input-interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="DESIGN">Design & Schematics Engineering (Forte, Facets, Aspect)</option>
                  <option value="BUILD">Construction & Supply Chain (OnSite, Loop, Sequence)</option>
                  <option value="OPERATE">Operations & Asset Optimization (Tempo, NetWorks, Attune)</option>
                  <option value="PROTECT">Public Safety & Cyber Integrity (OnCall, Coda, Cyber)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Additional Questions / Notes</label>
                <textarea
                  id="lead-input-notes"
                  rows={2}
                  placeholder="Interested in scheduling a live trial, learning about migration pathways, or pricing schedules..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              {/* Submit btn */}
              <button
                id="btn-lead-submit"
                type="submit"
                className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-tighter rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <Icons.Check className="w-4 h-4" />
                Submit and Save Design
              </button>
            </form>
          ) : (
            <div id="lead-submitted-success" className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <Icons.Check className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white">Thank You, {name}!</h4>
                <p className="text-xs text-neutral-400">Your architecture layout and contact details were saved successfully.</p>
              </div>

              <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto font-normal">
                An executive summarized brief outlining your designed topology, including detailed transition sheets for products replaces (like Smart 3D & HxGN EAM), is being compiled for you.
              </p>

              <button
                id="btn-lead-success-done"
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-lg border border-white/10 transition-all cursor-pointer"
              >
                Return to Canvas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
