export function initPWA(){
 if('serviceWorker' in navigator) navigator.serviceWorker.register('./pwa/service-worker.js').catch(console.error);
}
