import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Focus from './pages/Focus';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Focus />
  </StrictMode>,
)