import { useEffect, useRef, useState } from 'react';

interface Props {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

// Dismisses itself after `duration`, but waits while the pointer or keyboard focus is on it,
// so nobody loses the Undo button halfway through reaching for it.
export default function Toast({ message, onUndo, onDismiss, duration = 10000 }: Props) {
  const [held, setHeld] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const dismiss = useRef(onDismiss);
  useEffect(() => { dismiss.current = onDismiss; });

  useEffect(() => {
    // Hovered or focused, even mid-exit: come back and wait. The transition turns around where it is.
    if (held) { setLeaving(false); return; }
    // Fade out (160ms) before removal; with reduced motion the fade stays but does not move.
    let exit: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setLeaving(true);
      exit = setTimeout(() => dismiss.current(), 160);
    }, duration);
    return () => { clearTimeout(timer); clearTimeout(exit); };
  }, [held, duration]);

  return (
    <div className={`toast${leaving ? ' leaving' : ''}`} role="status"
      onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
      <span>{message}</span>
      <kbd aria-hidden="true">{/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'} Z</kbd>
      <button type="button" onClick={onUndo} aria-keyshortcuts="Control+Z Meta+Z">Undo</button>
    </div>
  );
}
