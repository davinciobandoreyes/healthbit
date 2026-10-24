import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DesignSystemShell } from './shell';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DesignSystemShell />
  </StrictMode>,
);
