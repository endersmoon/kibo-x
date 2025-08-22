'use client';

import { useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { 
  initializeFirebaseDataAtom,
  isFirebaseConnectedAtom,
  requisitionsLoadingAtom,
  candidatesLoadingAtom,
  requisitionsErrorAtom,
  candidatesErrorAtom
} from '@/lib/atoms';

export function FirebaseProvider({ children }) {
  const initializeData = useSetAtom(initializeFirebaseDataAtom);
  const isConnected = useAtomValue(isFirebaseConnectedAtom);
  const requisitionsLoading = useAtomValue(requisitionsLoadingAtom);
  const candidatesLoading = useAtomValue(candidatesLoadingAtom);
  const requisitionsError = useAtomValue(requisitionsErrorAtom);
  const candidatesError = useAtomValue(candidatesErrorAtom);

  useEffect(() => {
    // Initialize Firebase data when the component mounts
    const initialize = async () => {
      try {
        await initializeData();
      } catch (error) {
        console.error('Failed to initialize Firebase data:', error);
      }
    };

    initialize();
  }, [initializeData]);

  // Show loading state while initializing
  if (requisitionsLoading || candidatesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (requisitionsError || candidatesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">⚠️ Database Connection Issue</div>
          <p className="text-gray-600 mb-4">
            {requisitionsError || candidatesError || 'Failed to connect to Firebase'}
          </p>
          <p className="text-sm text-gray-500">
            The application is running with sample data. Please check your Firebase configuration.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Firebase connection status indicator */}
      {!isConnected && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 text-sm">
          ⚠️ Firebase not connected. Running with sample data.
        </div>
      )}
      {children}
    </div>
  );
}
