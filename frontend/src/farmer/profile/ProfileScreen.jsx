import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFarmerToken } from '../../auth/FarmerTokenContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MAHARASHTRA_DISTRICTS, CROPS_LIST } from '../../utils/constants';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import { User, Trash2, Edit3, ShieldAlert, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const { profile, hasProfile, deleteProfile } = useFarmerToken();
  const { lang, t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletedMsg, setDeletedMsg] = useState(false);

  const currentDistrictObj = MAHARASHTRA_DISTRICTS.find(d => d.id === profile?.district);

  const handleDelete = async () => {
    await deleteProfile();
    setDeletedMsg(true);
    setTimeout(() => {
      navigate('/onboarding');
    }, 1500);
  };

  if (!hasProfile || isEditing) {
    return (
      <div className="py-2">
        {isEditing && (
          <div className="max-w-md mx-auto px-4 pb-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold underline touch-target"
            >
              {lang === 'mr' ? '← रद्द करा आणि मागे जा' : '← Cancel & Go Back'}
            </button>
          </div>
        )}
        <OnboardingFlow isEditing={isEditing} onComplete={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
              🌾
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900 leading-tight">
                {t('nav_profile')}
              </h2>
              <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {lang === 'mr' ? 'अनामिक शेतकरी प्रोफाईल' : 'Anonymous Farmer Profile'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors touch-target flex items-center gap-1.5 text-xs font-semibold"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{lang === 'mr' ? 'बदला' : 'Edit'}</span>
          </button>
        </div>

        {/* Selected Data Overview */}
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              {lang === 'mr' ? 'जिल्हा व तालुका' : 'District & Taluka'}
            </span>
            <div className="font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center gap-2">
              <span>📍</span>
              <span>
                {lang === 'mr' ? currentDistrictObj?.name_mr : currentDistrictObj?.name_en || profile.district}
                {profile.taluka ? ` (तालुका: ${profile.taluka})` : ''}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              {lang === 'mr' ? 'नोंदणी केलेली पिके' : 'Selected Crops'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.crops?.map(cropId => {
                const cropObj = CROPS_LIST.find(c => c.id === cropId);
                return (
                  <span
                    key={cropId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium"
                  >
                    <span>{cropObj?.icon || '🌱'}</span>
                    <span>{lang === 'mr' ? cropObj?.name_mr : cropObj?.name_en || cropId}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              {lang === 'mr' ? 'भाषा प्राधान्य' : 'Language'}
            </span>
            <div className="font-semibold text-stone-800">
              {lang === 'mr' ? 'मराठी (Default)' : 'English'}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Box (DPDP Act) */}
      <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 text-xs text-stone-700 space-y-2">
        <div className="flex items-center gap-1.5 text-stone-900 font-bold">
          <Lock className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'mr' ? 'डेटा गोपनीयता हमी (DPDP Act 2023)' : 'Data Privacy Guarantee'}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-stone-600">
          {t('privacy_notice_body')}
        </p>
      </div>

      {/* Delete My Data Action */}
      <div className="bg-white rounded-2xl p-4 border border-rose-200/80 space-y-3">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{t('delete_my_data')}</span>
        </div>
        <p className="text-[11px] text-stone-500 leading-snug">
          {t('delete_confirm')}
        </p>

        {deletedMsg ? (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold text-center">
            {t('profile_deleted')}
          </div>
        ) : !confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors touch-target"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('delete_my_data')}</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2 px-3 rounded-xl text-xs touch-target"
            >
              {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xs touch-target flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'mr' ? 'होय, नष्ट करा' : 'Yes, Delete'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Portal Shortcut link */}
      <div className="pt-2 text-center">
        <Link
          to="/admin/login"
          className="text-[11px] text-stone-400 hover:text-stone-700 underline font-medium"
        >
          {t('admin_login')}
        </Link>
      </div>
    </div>
  );
};
