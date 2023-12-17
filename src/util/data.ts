import { NS, Player } from "@ns";
import { log } from "util/log";

/**
 * The data class must only use zero RAM cost functions.
 * Additional methods that use RAM must be defined in the main script.
 */

type Data = {
    name: string
    port: number,
    portType: "queue" | "state"
    file: string,
    set: (ns: NS, data: unknown) => void;
    get: (ns: NS) => JSON | undefined;
    peek: (ns: NS) => JSON;
};

export class DataStore {
    control: Data;
    player: Data;
    network: Data;

    constructor() {
        this.control = this.createDataObject("control", 1, "queue");
        this.player = this.createDataObject("player", 3, "state");
        this.network = this.createDataObject("network", 4, "state");
    }

    private createDataObject(name: string, port: number, portType: "queue" | "state"): Data {
        return {
            name,
            port,
            portType,
            file: `data/${name}.txt`,
            set: (ns: NS, data: unknown) => {
                this.writeData(ns, data, this.createDataObject(name, port, portType));
            },
            get: (ns: NS) => {
                return this.readData(ns, this.createDataObject(name, port, portType));
            },
            peek: (ns: NS) => {
                return this.peekPort(ns, this.createDataObject(name, port, portType));
            }
        };
    }

    private writeData(ns: NS, data: unknown, dataObject: Data): void {
        const jsonData = JSON.stringify(data, undefined, "\t");
        this.writePort(ns, jsonData, dataObject);
        if (dataObject.portType === "state") {
            // also write state to persistent file
            this.writeFile(ns, jsonData, dataObject);
        }
    }

    private writePort(ns: NS, jsonData: string, dataObject: Data): void {
        if (dataObject.portType === "state") {
            ns.clearPort(dataObject.port);
        } 
        log.TRACE.print(ns, `✍ ${dataObject.name} ${dataObject.portType} to port ${dataObject.port}`);
        ns.writePort(dataObject.port, jsonData);
    }

    private writeFile(ns: NS, jsonData: string, dataObject: Data): void {
        log.TRACE.print(ns, `✍ ${dataObject.name} ${dataObject.portType} to file ${dataObject.file}`);
        // there is no return value so no error handling without introducing RAM cost
        ns.write(dataObject.file, jsonData, "w");
    }

    private readData(ns: NS, dataObject: Data): JSON | undefined {
        const stringData = this.readPort(ns, dataObject);
        if (stringData != "NULL PORT DATA") {
            return JSON.parse(stringData);
        } else { // fallback to read from persistent file
            const jsonData = this.readFile(ns, dataObject);
            if (undefined != jsonData) { // write to port cache
                this.writePort(ns, JSON.stringify(jsonData), dataObject);                
            }
            return jsonData;
        }
    }

    private readPort(ns: NS, dataObject: Data): string {
        log.TRACE.print(ns, `👓 ${dataObject.name} ${dataObject.portType} from port ${dataObject.port}`);
        const stringData = ns.readPort(dataObject.port) as string;
        if (stringData === "NULL PORT DATA") {
            log.ERROR.print(ns, `Failed to read ${dataObject.name} ${dataObject.portType} from port ${dataObject.port}`);
        }
        return stringData;
    }

    private peekPort(ns: NS, dataObject: Data): JSON {
        log.TRACE.print(ns, `👀 ${dataObject.name} ${dataObject.portType} from port`);
        const stringData = ns.peek(dataObject.port) as string;
        if (stringData === "NULL PORT DATA") {
            log.ERROR.print(ns, `Failed to peek ${dataObject.name} ${dataObject.portType} from port ${dataObject.port}`);
            return JSON;
        } else {
            return JSON.parse(stringData);
        }
    }

    private readFile(ns: NS, dataObject: Data): JSON | undefined {
        log.TRACE.print(ns, `👓 ${dataObject.name} ${dataObject.portType} from ${dataObject.file}`);
        const jsonData = ns.read(dataObject.file);
        if (jsonData === "") {
            log.ERROR.print(ns, `Failed to read ${dataObject.name} ${dataObject.portType} from ${dataObject.file}`);
            return undefined ;
        } else {
            return JSON.parse(jsonData);
        }
    }
}

/**
 * MAIN function for debug testing
 * @remarks RAM cost: 0.5 GB
 */
export async function main(ns: NS): Promise<void> {
    writePlayerData(ns);
    const player = readPlayerData(ns);
    ns.print(`PlayerCity: ${player.city}`);
}

/**
 * Reads the player data from the data store.
 * @returns The player data.
 */
export function readPlayerData(ns: NS): Player {
    const dataStore = new DataStore();
    return dataStore.player.get(ns) as unknown as Player;
}

/**
 * Writes the player data to the data store.
 * @returns The player data.
 */
export function writePlayerData(ns: NS): Player {
    log.TRACE.print(ns, `ns.getPlayer()`);
    const player = ns.getPlayer();
    const dataStore = new DataStore();
    dataStore.player.set(ns, player);
    return player;
}

/**
 * Deletes files matching the specified pattern from the given server.
 * @param ns - The netscript interface to bitburner functions.
 * @param filePattern - The pattern to match the file names against. Defaults to "/data/".
 * @param sourceServer - The server from which to delete the files. Defaults to "home".
 */
export function deleteFiles(ns: NS, filePattern = "/data/", sourceServer = "home") {
    const filePaths = ns.ls(sourceServer, filePattern);
    filePaths.forEach((filePath) => {
        ns.rm(filePath);
    });
}

/**
 * Writes a list of file paths to a specified file.
 * @param ns - The netscript interface to bitburner functions.
 * @param file - The path of the file to write the list of file paths to. Defaults to "data/malware.txt".
 * @param filePattern - The pattern to match file paths against. Defaults to "/malware/".
 * @param sourceServer - The name of the server to search for file paths. Defaults to "home".
 * @param mode - The write mode. Defaults to "w".
 * @returns An array of file paths that were written to the file.
 */
export function writeFileList(ns: NS, file = "data/malware.txt", filePattern = "/malware/", sourceServer = "home", mode: ("w" | "a") = "w"): string[] {
    const filePaths = ns.ls(sourceServer, filePattern);
    if (mode === "a") { // insert blank space and new line before appending to end of file
        filePaths.unshift('');
    }
    ns.write(file, filePaths.join('\n'), mode);
    return filePaths
}

/**
 * Reads a txt file and returns its contents as an array of strings.
 * @param ns - The netscript interface to bitburner functions.
 * @param file - The path of the file to read. Defaults to "data/malware.txt".
 * @returns An array of strings representing the lines in the file.
 */
export function readTextFile(ns: NS, file = "data/malware.txt"): string[] {
    return ns.read(file).split('\n');
}
