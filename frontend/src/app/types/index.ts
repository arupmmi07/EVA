export type AppView = 'dashboard' | 'patientSummary' | 'soapNote' | 'sessionActive';

/** Drives scripted demo progression (typed chat + recording steps). */
export type DemoPhase =
  | 'welcome'
  | 'patientSummary'
  | 'tearAnswered'
  | 'soapPrefill'
  | 'sessionReady'
  | 'sessionRecording'
  | 'sessionTranscript'
  | 'sessionPostRom'
  | 'strengthAnswered';

export type SOAPVariant = 'prefill' | 'sessionRecording' | 'transcript' | 'postRom';

export type MessageType =
  | 'eva-text'
  | 'user-bubble'
  | 'patient-card'
  | 'alert-message'
  | 'suggestion-chips'
  | 'tear-detail'
  | 'prefill-message'
  | 'session-starting'
  | 'session-widget'
  | 'rom-captured'
  | 'pattern-note';

export interface SuggestionChip {
  label: string;
  action?: string;
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content?: string;
  timestamp?: string;
  chips?: SuggestionChip[];
}

export interface PatientInfo {
  name: string;
  id: string;
  age: string;
  condition: string;
  tags: string[];
  status: string;
  intakeFlags: string[];
}

export interface SOAPSection {
  key: string;
  label: string;
  color: string;
  count: number;
  expanded: boolean;
}
