declare module 'leemon' {
  export function addShift_(x: any, y: any, ys: any): any;
  export function carry_(x: any): any;
  export function divide_(x: any, y: any, q: any, r: any): any;
  export function divInt_(x: any, n: any): any;
  export function eGCD_(x: any, y: any, d: any, a: any, b: any): any;
  export function halve_(x: any): any;
  export function leftShift_(x: any, n: any): any;
  export function linComb_(x: any, y: any, a: any, b: any): any;
  export function linCombShift_(x: any, y: any, b: any, ys: any): any;
  export function mont_(x: any, y: any, n: any, np: any): any;
  export function multInt_(x: any, n: any): any;
  export function rightShift_(x: any, n: any): any;
  export function squareMod_(x: any, n: any): any;
  export function subShift_(x: any, y: any, ys: any): any;

  export function addInt_(x: any, n: any): any;
  export function add_(x: any, y: any): any;
  export function copy_(x: any, y: any): any;
  export function copyInt_(x: any, n: any): any;
  export function GCD_(x: any, y: any): any;
  export function inverseMod_(x: any, n: any): any;
  export function mod_(x: any, n: any): any;
  export function mult_(x: any, y: any): any;
  export function multMod_(x: any, y: any, n: any): any;
  export function powMod_(x: any, y: any, n: any): any;
  export function randBigInt_(b: any, n: any, s: any): any;
  export function randTruePrime_(ans: any, k: any): any;
  export function sub_(x: any, y: any): any;

  export function greater(a: any, b: any): any;
  export function isZero(a: any): any;
  export function equalsInt(a: any): any;
  export function bigInt2str(a: any, b: any): any;
  export function str2bigInt(a: any): any;
  export function powMod(a: any): any;
  export function bigInt2str(a:any):any;
  export const one: any;
  export const bpe: number;
}
