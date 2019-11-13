import { T } from 'app/core/dom';
import App from 'app/ui/app';

const rootEl = document.getElementById('root');

if (rootEl) {
  rootEl.appendChild(<App />);
}

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/build.sw.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }