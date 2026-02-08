"use client";
import { useAuth } from '@/contexts/authContext.tsx';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { JSX } from 'react';

const GlobalErrorToast = (): JSX.Element | null => {
  const { globalError } = useAuth();

  if (!globalError) 
    return null;
  return (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">  
    <div className="bg-red-400/70 text-white px-6 py-1.5 rounded-lg border border-gray-500 flex items-center gap-3">
      <ExclamationCircleIcon className='size-6' />
      <span className="font-semibold text-sm">{globalError}</span>

    </div>
  </div>
  )
}

export default GlobalErrorToast
