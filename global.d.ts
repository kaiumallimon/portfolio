// global.d.ts
export {};

declare module "three";
declare module "ogl";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
