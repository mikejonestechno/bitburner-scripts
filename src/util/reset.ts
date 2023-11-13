import { NS } from "@ns";

export function main(ns: NS) {
    const filePaths = ns.ls("home", "data/");
    filePaths.forEach((filePath) => {
        ns.tprint(`removing ${filePath}`);
        ns.rm(filePath);
    });
}
