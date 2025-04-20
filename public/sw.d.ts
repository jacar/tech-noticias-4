// TypeScript declarations for Service Worker API
interface ExtendedEvent extends Event {
  waitUntil(promise: Promise<any>): void;
}

interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Response | Promise<Response>): void;
}

interface WorkerGlobalScope {
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
  addEventListener(type: 'install', listener: (event: ExtendedEvent) => void): void;
  addEventListener(type: 'activate', listener: (event: ExtendedEvent) => void): void;
  addEventListener(type: 'fetch', listener: (event: FetchEvent) => void): void;
}

declare const self: ServiceWorkerGlobalScope;
