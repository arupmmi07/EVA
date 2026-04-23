/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When `"1"`, chat posts to `/api/eva/chat` (proxied to Flask). */
  readonly VITE_EVA_USE_BACKEND?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'figma:asset/*' {
  const src: string;
  export default src;
}
