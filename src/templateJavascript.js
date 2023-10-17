// for text editor intellisense we need to import the netscape definitions

// for typescript files just need to import @ns 
// import { NS } from "@ns";

// for javascript files need to add jsdoc param to import @ns
/** @param {import("@ns").NS } ns **/
export async function main(ns) {
  ns.tprint("Hello Remote API!");
}
