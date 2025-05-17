import { Suspense } from 'react';
import StatusPageContent from './StatusPageContent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusPageContent />
    </Suspense>
  );
}
