import fs from "fs";

export class NodeDB extends Map {
    private name: string;
    constructor(name: string) {
        super();

        if (typeof name !== "string") throw new TypeError("Database name must be a string");
        this.name = name;

        if (!fs.existsSync("./db/")) fs.mkdirSync("./db/");
        if (!fs.existsSync(`./db/${name}/`)) fs.mkdirSync(`./db/${name}/`);

        this.load();
    }

    public load() {
        const files = fs.readdirSync(`./db/${this.name}/`);
        files.forEach((file) => {
            const data = fs.readFileSync(`./db/${this.name}/${file}`, {
                encoding: "utf8",
            });
            const key = file.replace(".json", "");
            super.set(key, JSON.parse(data));
        });
    }

    public set(key: string, value: any): this {
        this.keyCheck(key);

        super.set(key, value);
        fs.writeFileSync(`./db/${this.name}/${key}.json`, JSON.stringify(value, null, 4));
        return this;
    }

    public delete(key: string): boolean {
        this.keyCheck(key);

        const result = super.delete(key);
        fs.rmSync(`./db/${this.name}/${key}.json`);
        return result;
    }

    public clear(): void {
        super.clear();
        fs.rmSync(`./db/${this.name}/`, { recursive: true });
    }

    private keyCheck(key: string) {
        if (typeof key !== "string") throw new TypeError("Database key must be a string");

        if (key.search(/[^a-z0-9_-.]/gi) !== -1)
            throw new TypeError("Key must only contain alphanumeric characters and underscores");
    }
}
