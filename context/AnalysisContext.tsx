import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { USE_MOCK } from '../constants/config';
import { getMockAnalysis } from '../services/mockAnalysis';
import { analyzeRoomPhotos } from '../services/openaiVision';
import { AnalysisResult } from '../types/analysis';

type AnalysisContextValue = {
  photos: string[];
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  addPhoto: (base64: string) => void;
  removePhoto: (index: number) => void;
  clearPhotos: () => void;
  analyzePhotos: () => Promise<boolean>;
  clearResult: () => void;
  reset: () => void;
};

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPhoto = useCallback((base64: string) => {
    setPhotos((current) => [...current, base64]);
    setError(null);
  }, []);

  const removePhoto = useCallback((index: number) => {
    setPhotos((current) => current.filter((_, i) => i !== index));
  }, []);

  const clearPhotos = useCallback(() => {
    setPhotos([]);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setPhotos([]);
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  const analyzePhotos = useCallback(async () => {
    if (photos.length === 0 && !USE_MOCK) {
      setError('Take at least one photo before analyzing.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const analysis = USE_MOCK ? await getMockAnalysis() : await analyzeRoomPhotos(photos);
      setResult(analysis);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(message);
      setResult(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [photos]);

  const value = useMemo(
    () => ({
      photos,
      result,
      loading,
      error,
      addPhoto,
      removePhoto,
      clearPhotos,
      analyzePhotos,
      clearResult,
      reset,
    }),
    [
      photos,
      result,
      loading,
      error,
      addPhoto,
      removePhoto,
      clearPhotos,
      analyzePhotos,
      clearResult,
      reset,
    ],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }

  return context;
}
