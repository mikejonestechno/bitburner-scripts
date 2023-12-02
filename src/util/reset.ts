import { NS } from "@ns";
import { clearData, clearAllData, refreshPlayerData } from "util/data";

/**
 * Resets the game data by clearing all data and refreshing the player data.
 * @param ns - The netscript interface to bitburner functions.
 * @returns A promise that resolves once the reset is complete.
 * @remarks RAM cost: 3.3 GB (base, rm, ls, getPlayer)
 */
export async function main(ns: NS): Promise<void> {
    clearData(ns);
    clearAllData(ns);
    refreshPlayerData(ns, true);
}
