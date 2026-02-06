"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from "react";

interface StoryState {
  isTriggered: boolean;
  scrollEnabled: boolean;
  navbarVisible: boolean;
  introPopupVisible: boolean;
}

interface StoryContextValue extends StoryState {
  triggerStory: () => void;
  showIntroPopup: () => void;
  hideIntroPopup: () => void;
}

const StoryContext = createContext<StoryContextValue | null>(null);

const SESSION_KEY = "story_triggered";

// Animation timing constants
const INTRO_POPUP_DELAY = 300;
const SCROLL_ENABLE_DELAY = 800;

export function StoryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoryState>({
    isTriggered: false,
    scrollEnabled: false,
    navbarVisible: false,
    introPopupVisible: false,
  });

  // Refs for timeout cleanup
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Check session storage on mount (returning visitor skip animation)
  useEffect(() => {
    // SSR guard for sessionStorage
    if (typeof window === "undefined") return;

    const wasTriggered = sessionStorage.getItem(SESSION_KEY);
    if (wasTriggered === "true") {
      setState({
        isTriggered: true,
        scrollEnabled: true,
        navbarVisible: true,
        introPopupVisible: false,
      });
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Lock/unlock scroll based on state
  useEffect(() => {
    if (state.scrollEnabled) {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
  }, [state.scrollEnabled]);

  const triggerStory = useCallback(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Mark as triggered in session
    sessionStorage.setItem(SESSION_KEY, "true");

    // Phase 1: Trigger ripple effect (handled by HeroStory)
    setState((prev) => ({ ...prev, isTriggered: true }));

    // Phase 2: Show intro popup after ripple
    const popupTimeout = setTimeout(() => {
      setState((prev) => ({ ...prev, introPopupVisible: true }));
    }, INTRO_POPUP_DELAY);
    timeoutsRef.current.push(popupTimeout);

    // Phase 3: Enable scroll + navbar
    const scrollTimeout = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        scrollEnabled: true,
        navbarVisible: true,
      }));
    }, SCROLL_ENABLE_DELAY);
    timeoutsRef.current.push(scrollTimeout);
  }, []);

  const showIntroPopup = useCallback(() => {
    setState((prev) => ({ ...prev, introPopupVisible: true }));
  }, []);

  const hideIntroPopup = useCallback(() => {
    setState((prev) => ({ ...prev, introPopupVisible: false }));
  }, []);

  return (
    <StoryContext.Provider
      value={{
        ...state,
        triggerStory,
        showIntroPopup,
        hideIntroPopup,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within StoryProvider");
  }
  return context;
}
