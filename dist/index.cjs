var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.js
var crypto_hash_exports = {};
__export(crypto_hash_exports, {
  sha1: () => sha1,
  sha256: () => sha256,
  sha384: () => sha384,
  sha512: () => sha512
});
module.exports = __toCommonJS(crypto_hash_exports);

// node_modules/.pnpm/tsup@8.0.2_typescript@5.4.3/node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// index.js
var import_node_buffer = require("buffer");
var import_node_worker_threads = require("worker_threads");
var import_node_crypto = __toESM(require("crypto"), 1);
var import_node_path = __toESM(require("path"), 1);
var import_node_url = __toESM(require("url"), 1);
var create = (algorithm) => async (buffer, { outputFormat = "hex" } = {}) => {
  const hash = import_node_crypto.default.createHash(algorithm);
  hash.update(buffer, typeof buffer === "string" ? "utf8" : void 0);
  if (outputFormat === "hex") {
    return hash.digest("hex");
  }
  return hash.digest().buffer;
};
if (import_node_worker_threads.Worker !== void 0) {
  const ext = import_node_path.default.extname(import_node_url.default.fileURLToPath(importMetaUrl));
  const threadFilePath = import_node_url.default.pathToFileURL(import_node_path.default.resolve("thread" + ext));
  let worker;
  let taskIdCounter = 0;
  const tasks = /* @__PURE__ */ new Map();
  const createWorker = () => {
    worker = new import_node_worker_threads.Worker(threadFilePath);
    worker.on("message", (message) => {
      const task = tasks.get(message.id);
      tasks.delete(message.id);
      if (tasks.size === 0) {
        worker.unref();
      }
      task(message.value);
    });
    worker.on("error", (error) => {
      throw error;
    });
  };
  const taskWorker = (value, transferList) => new Promise((resolve) => {
    const id = taskIdCounter++;
    tasks.set(id, resolve);
    if (worker === void 0) {
      createWorker();
    }
    worker.ref();
    worker.postMessage({ id, value }, transferList);
  });
  create = (algorithm) => async (source, { outputFormat = "hex" } = {}) => {
    let buffer;
    if (typeof source === "string") {
      buffer = new ArrayBuffer(import_node_buffer.Buffer.byteLength(source, "utf8"));
      import_node_buffer.Buffer.from(buffer).write(source, "utf8");
    } else {
      const finalSource = source instanceof ArrayBuffer ? new Uint8Array(source) : source;
      buffer = finalSource.buffer.slice(0);
    }
    const result = await taskWorker({ algorithm, buffer }, [buffer]);
    if (outputFormat === "hex") {
      return import_node_buffer.Buffer.from(result).toString("hex");
    }
    return result;
  };
}
var sha1 = create("sha1");
var sha256 = create("sha256");
var sha384 = create("sha384");
var sha512 = create("sha512");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sha1,
  sha256,
  sha384,
  sha512
});
