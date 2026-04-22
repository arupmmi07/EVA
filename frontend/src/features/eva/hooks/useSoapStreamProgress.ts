import { useEffect, useRef, useState } from 'react';

/** Number of reveal ticks over {@link SOAP_STREAM_DURATION_MS} while recording. */
export const SOAP_STREAM_TOTAL_STEPS = 20;

/** Total wall time for line-by-line SOAP population (ms). */
export const SOAP_STREAM_DURATION_MS = 10_000;

/**
 * Advances a step counter on a fixed interval while `isStreaming` is true.
 * Pauses when `isPaused`. Jumps to max when `forceComplete`.
 */
export function useSoapStreamProgress(isStreaming: boolean, isPaused: boolean, forceComplete: boolean) {
  const [step, setStep] = useState(0);
  const wasStreamingRef = useRef(false);

  useEffect(() => {
    if (forceComplete) {
      setStep(SOAP_STREAM_TOTAL_STEPS);
      wasStreamingRef.current = false;
      return;
    }

    if (!isStreaming) {
      wasStreamingRef.current = false;
      setStep(0);
      return;
    }

    if (isPaused) {
      return;
    }

    if (!wasStreamingRef.current) {
      wasStreamingRef.current = true;
      setStep(0);
    }

    const tickMs = Math.max(1, Math.floor(SOAP_STREAM_DURATION_MS / SOAP_STREAM_TOTAL_STEPS));
    const id = window.setInterval(() => {
      setStep((s) => (s >= SOAP_STREAM_TOTAL_STEPS ? s : s + 1));
    }, tickMs);

    return () => window.clearInterval(id);
  }, [isStreaming, isPaused, forceComplete]);

  return {
    step,
    progress: SOAP_STREAM_TOTAL_STEPS === 0 ? 0 : Math.min(1, step / SOAP_STREAM_TOTAL_STEPS),
  };
}
