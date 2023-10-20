"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeDB = void 0;
const fs_1 = __importDefault(require("fs"));
class NodeDB extends Map {
    constructor(name) {
        super();
        if (typeof name !== "string")
            throw new TypeError("Database name must be a string");
        this.name = name;
        if (!fs_1.default.existsSync("./db/")) {
            fs_1.default.mkdirSync("./db/");
        }
        if (!fs_1.default.existsSync(`./db/${name}/`)) {
            fs_1.default.mkdirSync(`./db/${name}/`);
        }
        this.load();
    }
    load() {
        const files = fs_1.default.readdirSync(`./db/${this.name}/`);
        files.forEach((file) => {
            const data = fs_1.default.readFileSync(`./db/${this.name}/${file}`, {
                encoding: "utf8",
            });
            const key = file.replace(".json", "");
            super.set(key, JSON.parse(data));
        });
    }
    set(key, value) {
        this.keyCheck(key);
        super.set(key, value);
        fs_1.default.writeFileSync(`./db/${this.name}/${key}.json`, JSON.stringify(value, null, 4));
        return this;
    }
    delete(key) {
        this.keyCheck(key);
        const result = super.delete(key);
        fs_1.default.rmSync(`./db/${this.name}/${key}.json`);
        return result;
    }
    clear() {
        super.clear();
        fs_1.default.rmSync(`./db/${this.name}/`, { recursive: true });
    }
    keyCheck(key) {
        if (typeof key !== "string")
            throw new TypeError("Database key must be a string");
        if (key.search(/[^a-z0-9_]/gi) !== -1)
            throw new TypeError("Key must only contain alphanumeric characters and underscores");
    }
}
exports.NodeDB = NodeDB;
