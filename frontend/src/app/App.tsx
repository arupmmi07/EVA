import { createHashRouter, Navigate, RouterProvider } from 'react-router';
import { EvaWorkflowApp } from '@/features/eva/EvaWorkflowApp';
import type { MomentId } from '@/moments/momentTypes';

function MomentPage({ momentId }: { momentId: MomentId }) {
  /** Remount workflow when switching moments (same component type at the same route depth). */
  return <EvaWorkflowApp key={momentId} momentId={momentId} />;
}

/** Single instance — avoids remounting the router in React StrictMode. */
const router = createHashRouter([
  // { path: '/', element: <Navigate to="moment1" replace /> },
  { path: 'moment1', element: <MomentPage momentId="moment1" /> },
  { path: 'moment2', element: <MomentPage momentId="moment2" /> },
  { path: 'moment3', element: <MomentPage momentId="moment3" /> },
  { path: '*', element: <Navigate to="moment1" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
