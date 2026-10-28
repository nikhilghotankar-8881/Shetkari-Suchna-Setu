import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFarmerToken } from '../auth/FarmerTokenContext';
import { PlayCircle, RefreshCw, Smartphone, Shield, CheckCircle2, ChevronUp, ChevronDown, Zap } from 'lucide-react';

export const DemoController = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { deleteProfile, saveProfile } = useFarmerToken();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleSimulateChange = () => {
    setStepMessage('⚡ Govt Source Changed: MahaDBT revised deadline to 30 Nov 2026!');
    // Trigger simulated change in localStorage for live demo
    const simulatedAlert = {
      id: Date.now(),
      kind: 'CHANGED',
      title_mr: 'महत्त्वाची सुधारणा: ट्रॅक्टर अनुदानाची मुदत ३० नोव्हेंबरपर्यंत वाढवली',
      title_en: 'Important Update: Tractor Subsidy Deadline extended to 30 Nov',
      body_mr: 'शासन निर्णयानुसार ट्रॅक्टर अनुदानासाठी ३० नोव्हेंबर २०२६ पर्यंत अर्ज करता येतील.',
      body_en: 'As per official GR, applications for tractor subsidy are open till 30 Nov 2026.',
      scheme_id: 1,
      created_at: new Date().toISOString(),
      read: false
    };

    try {
      const existing = JSON.parse(localStorage.getItem('sss_demo_alerts') || '[]');
      localStorage.setItem('sss_demo_alerts', JSON.stringify([simulatedAlert, ...existing]));
    } catch {}

    setTimeout(() => {
      setStepMessage('✓ Step 3 & 4: Detected & queued in Admin Review Queue');
    }, 1200);

    setTimeout(() => {
      setStepMessage('');
    }, 4500);
  };

  const handleResetFarmer = async () => {
    await deleteProfile();
    navigate('/onboarding');
    setIsOpen(false);
  };

  const handleQuickSeedFarmer = async () => {
    await saveProfile({
      district: 'pune',
      taluka: 'हवेली',
      crops: ['soybean', 'cotton', 'sugarcane'],
      lang: 'mr'
    });
    navigate('/schemes');
    setIsOpen(false);
  };

  return (
    <div className="fixed top-3 right-3 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/90 text-emerald-200 hover:text-white border border-emerald-600/70 shadow-lg text-[11px] font-bold backdrop-blur-md transition-all touch-target"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Demo Tool</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      ) : (
        <div className="bg-stone-900 border border-stone-700 text-stone-200 rounded-2xl p-4 shadow-2xl w-80 text-xs space-y-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>Hackathon Demo Helper</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {stepMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-600 text-emerald-200 text-[11px] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{stepMessage}</span>
            </div>
          )}

          {/* Demo Actions */}
          <div className="space-y-2">
            <button
              onClick={handleSimulateChange}
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors touch-target"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate Govt Notice Change</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {isAdminRoute ? (
                <button
                  onClick={() => navigate('/schemes')}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 touch-target"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Farmer View</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/admin/review')}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 touch-target"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin View</span>
                </button>
              )}

              <button
                onClick={handleResetFarmer}
                className="bg-stone-800 hover:bg-stone-700 text-rose-300 font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 touch-target"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Profile</span>
              </button>
            </div>

            <button
              onClick={handleQuickSeedFarmer}
              className="w-full bg-emerald-800/60 hover:bg-emerald-800 text-emerald-200 py-1.5 px-3 rounded-xl text-[11px] font-medium border border-emerald-700/60 touch-target"
            >
              Seed Profile (Pune • Soybean, Cotton)
            </button>
          </div>

          {/* 6 Step Demo Script Quick Reference */}
          <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-400 space-y-1">
            <div className="font-bold text-stone-300 uppercase tracking-wider">Demo Script:</div>
            <div>1. Farmer profile → matched scheme cards</div>
            <div>2. Trigger change simulation</div>
            <div>3. Admin Review Queue verifies evidence</div>
            <div>4. Farmer Inbox receives verified alert</div>
            <div>5. Tap official source GR link</div>
          </div>
        </div>
      )}
    </div>
  );
};

