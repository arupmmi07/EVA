/** When true, chat submits to Flask `POST /api/eva/chat` (Vite dev server proxies `/api` to port 5000). */
export function isEvaBackendChatEnabled(): boolean {
  return import.meta.env.VITE_EVA_USE_BACKEND === '1';
}
