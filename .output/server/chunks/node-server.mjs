globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, createError, createApp, createRouter, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createRouter as createRouter$1 } from 'radix3';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      return decodeURI(parseURL(event.req.originalUrl || event.req.url).pathname).replace(/\/$/, "/index");
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event);
    const headers = event.res.getHeaders();
    headers.Etag = `W/"${hash(body)}"`;
    headers["Last-Modified"] = new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["Cache-Control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["Last-Modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(req, header, includes) {
  const value = req.headers[header];
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event.req, "accept", "application/json") || hasReqHeader(event.req, "user-agent", "curl/") || hasReqHeader(event.req, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Route Not Found" : "Internal Server Error");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(_error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(_error);
  const errorObject = {
    url: event.req.url,
    statusCode,
    statusMessage,
    message,
    description: "",
    data: _error.data
  };
  event.res.statusCode = errorObject.statusCode;
  event.res.statusMessage = errorObject.statusMessage;
  if (errorObject.statusCode !== 404) {
    console.error("[nuxt] [request error]", errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
    return;
  }
  const url = withQuery("/__nuxt_error", errorObject);
  const html = await $fetch(url).catch((error) => {
    console.error("[nitro] Error while generating error response", error);
    return errorObject.statusMessage;
  });
  event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
  event.res.end(html);
});

const assets = {
  "/_nuxt/bg.cba2c3b7.jpeg": {
    "type": "image/jpeg",
    "etag": "\"1d288-haoDCyBSACD8rDCbokaZFpjxz5U\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/bg.cba2c3b7.jpeg"
  },
  "/_nuxt/cookie-f17a9688.mjs": {
    "type": "application/javascript",
    "etag": "\"849-2bqDG+e6DouRI1u1EQ0bRQim/SI\"",
    "mtime": "2022-06-22T16:31:28.839Z",
    "path": "../public/_nuxt/cookie-f17a9688.mjs"
  },
  "/_nuxt/default-78e02594.mjs": {
    "type": "application/javascript",
    "etag": "\"c0-63S5YE9qm2WR/21pvP0+S2jXe04\"",
    "mtime": "2022-06-22T16:31:28.839Z",
    "path": "../public/_nuxt/default-78e02594.mjs"
  },
  "/_nuxt/entry-bd46a3d3.mjs": {
    "type": "application/javascript",
    "etag": "\"1fbab-6O2vTz/eeDxYi1pyq5eB4g1p9lU\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/entry-bd46a3d3.mjs"
  },
  "/_nuxt/entry.e941338d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9d54-7fT7xFNx/tV+c1kb0VzsI5I3cyk\"",
    "mtime": "2022-06-22T16:31:28.839Z",
    "path": "../public/_nuxt/entry.e941338d.css"
  },
  "/_nuxt/fetch-6f56b794.mjs": {
    "type": "application/javascript",
    "etag": "\"1d01-UtSaahDLZ6FKcwNiPOtmLvrG4Zw\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/fetch-6f56b794.mjs"
  },
  "/_nuxt/index-74266ca7.mjs": {
    "type": "application/javascript",
    "etag": "\"5e8-EDwIDq+l8YGoHTESlgi3K2kxXwI\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/index-74266ca7.mjs"
  },
  "/_nuxt/index-82e0ce3f.mjs": {
    "type": "application/javascript",
    "etag": "\"bab9-DBudfvVKBQBqjRjGWJ9LeM+y3ww\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/index-82e0ce3f.mjs"
  },
  "/_nuxt/info-8140c2fa.mjs": {
    "type": "application/javascript",
    "etag": "\"103a-qBULO7T5o6ufnjD7z8nE4OsiMQE\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/info-8140c2fa.mjs"
  },
  "/_nuxt/login-203f4cfd.mjs": {
    "type": "application/javascript",
    "etag": "\"dc7-avl+EZgECDiV9upg73BPuoOl32Y\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/login-203f4cfd.mjs"
  },
  "/_nuxt/lookup-b61c657e.mjs": {
    "type": "application/javascript",
    "etag": "\"a79-egaYVXaxNDxpAS2A+O2ClZe7WWU\"",
    "mtime": "2022-06-22T16:31:28.839Z",
    "path": "../public/_nuxt/lookup-b61c657e.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"ea7-vp6ziG2DDt3Alh2vicjMZq5eWhE\"",
    "mtime": "2022-06-22T16:31:28.832Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/panel-c4182981.mjs": {
    "type": "application/javascript",
    "etag": "\"6aa-8fso7jOmuH8IjfJxHBoMRx3TuvI\"",
    "mtime": "2022-06-22T16:31:28.840Z",
    "path": "../public/_nuxt/panel-c4182981.mjs"
  },
  "/_nuxt/panel.e46eeaaa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4654-ufKJSmWQy9U9TB2X2hE1I8FedQ4\"",
    "mtime": "2022-06-22T16:31:28.839Z",
    "path": "../public/_nuxt/panel.e46eeaaa.css"
  },
  "/_nuxt/scan-3e8bd4bd.mjs": {
    "type": "application/javascript",
    "etag": "\"17b3-P7tgUmDcU7OH/ClSW2i8cAcdprM\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/scan-3e8bd4bd.mjs"
  },
  "/_nuxt/utils-c8dfd953.mjs": {
    "type": "application/javascript",
    "etag": "\"57-GTzCC51EgumkJVbDR5AQSU9BHz0\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/utils-c8dfd953.mjs"
  },
  "/_nuxt/vue-tabler-icons.es-caf75899.mjs": {
    "type": "application/javascript",
    "etag": "\"16e9-WQKuQ03pYD790M20w5372ZYrKBo\"",
    "mtime": "2022-06-22T16:31:28.838Z",
    "path": "../public/_nuxt/vue-tabler-icons.es-caf75899.mjs"
  },
  "/_nuxt/withAuth-c8572bda.mjs": {
    "type": "application/javascript",
    "etag": "\"222-n0vBkxclhVT7W+zjQw6Kvhm0JVk\"",
    "mtime": "2022-06-22T16:31:28.839Z",
    "path": "../public/_nuxt/withAuth-c8572bda.mjs"
  },
  "/_nuxt/withoutAuth-dbd5fcd6.mjs": {
    "type": "application/javascript",
    "etag": "\"c5-XkE+tJXur4Bb5IgVOQY0rnbEy/4\"",
    "mtime": "2022-06-22T16:31:28.839Z",
    "path": "../public/_nuxt/withoutAuth-dbd5fcd6.mjs"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = ["/_nuxt"];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const _152570 = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  for (const _id of [id, id + "/index.html"]) {
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
      break;
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

const _lazy_176782 = () => import('./all.mjs');
const _lazy_120935 = () => import('./_id_.mjs');
const _lazy_406711 = () => import('./login.post.mjs');
const _lazy_220924 = () => import('./scan.post.mjs');
const _lazy_265350 = () => import('./all2.mjs');
const _lazy_279179 = () => import('./_id_2.mjs');
const _lazy_316025 = () => import('./sklad.mjs');
const _lazy_193749 = () => import('./lookup.mjs');
const _lazy_343953 = () => import('./renderer.mjs').then(function (n) { return n.a; });

const handlers = [
  { route: '', handler: _152570, lazy: false, middleware: true, method: undefined },
  { route: '/api/zakaz/all', handler: _lazy_176782, lazy: true, middleware: false, method: undefined },
  { route: '/api/zakaz/:id', handler: _lazy_120935, lazy: true, middleware: false, method: undefined },
  { route: '/api/user/login', handler: _lazy_406711, lazy: true, middleware: false, method: "post" },
  { route: '/api/tovar/scan', handler: _lazy_220924, lazy: true, middleware: false, method: "post" },
  { route: '/api/tovar/all', handler: _lazy_265350, lazy: true, middleware: false, method: undefined },
  { route: '/api/tovar/:id', handler: _lazy_279179, lazy: true, middleware: false, method: undefined },
  { route: '/api/sklad', handler: _lazy_316025, lazy: true, middleware: false, method: undefined },
  { route: '/api/lookup', handler: _lazy_193749, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_343953, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_343953, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter();
  const routerOptions = createRouter$1({ routes: config.nitro.routes });
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    const referenceRoute = h.route.replace(/:\w+|\*\*/g, "_");
    const routeOptions = routerOptions.lookup(referenceRoute) || {};
    if (routeOptions.swr) {
      handler = cachedEventHandler(handler, {
        group: "nitro/routes"
      });
    }
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(h3App.nodeHandler);
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, nitroApp.h3App.nodeHandler) : new Server$1(nitroApp.h3App.nodeHandler);
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const hostname = process.env.NITRO_HOST || process.env.HOST || "0.0.0.0";
server.listen(port, hostname, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  console.log(`Listening on ${protocol}://${hostname}:${port}${useRuntimeConfig().app.baseURL}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { nodeServer as n, useRuntimeConfig as u };
//# sourceMappingURL=node-server.mjs.map
