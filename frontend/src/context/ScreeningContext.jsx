import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "pacu_tumbuh_screening_session";

const defaultSession = {
  profile: null,
  healthHistory: null,
  communication: null,
  communicationResult: null,
  motor: null,
  motorResult: null,
  nutrition: null,
  nutritionResult: null,
  evaluationResult: null,
};

const ScreeningContext = createContext(null);

export function ScreeningProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultSession, ...JSON.parse(saved) } : defaultSession;
    } catch {
      return defaultSession;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const setProfile = useCallback((profile) => {
    setSession((prev) => ({ ...prev, profile }));
  }, []);

  const setHealthHistory = useCallback((healthHistory) => {
    setSession((prev) => ({ ...prev, healthHistory }));
  }, []);

  const setCommunication = useCallback((communication, communicationResult) => {
    setSession((prev) => ({ ...prev, communication, communicationResult }));
  }, []);

  const setMotor = useCallback((motor, motorResult) => {
    setSession((prev) => ({ ...prev, motor, motorResult }));
  }, []);

  const setNutrition = useCallback((nutrition, nutritionResult) => {
    setSession((prev) => ({ ...prev, nutrition, nutritionResult }));
  }, []);

  const setEvaluationResult = useCallback((evaluationResult) => {
    setSession((prev) => ({ ...prev, evaluationResult }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(defaultSession);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ScreeningContext.Provider
      value={{
        session,
        setProfile,
        setHealthHistory,
        setCommunication,
        setMotor,
        setNutrition,
        setEvaluationResult,
        resetSession,
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error("useScreening must be used within ScreeningProvider");
  return ctx;
}
