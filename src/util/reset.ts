import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    const filePaths = ns.ls("home", "data/");
    filePaths.forEach((filePath) => {
        ns.tprint(`removing ${filePath}`);
        ns.rm(filePath);
    });
}
