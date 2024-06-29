/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-3b6963d6'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "assets/app-16230802.js",
    "revision": null
  }, {
    "url": "assets/index-d5613d85.css",
    "revision": null
  }, {
    "url": "assets/Landing-5e1431fc.js",
    "revision": null
  }, {
    "url": "assets/Landing-e60029e5.css",
    "revision": null
  }, {
    "url": "assets/Map-02c0e2af.js",
    "revision": null
  }, {
    "url": "assets/Map-bedb3288.css",
    "revision": null
  }, {
    "url": "assets/session-b99ab5f7.js",
    "revision": null
  }, {
    "url": "assets/Sponsor-0c483777.js",
    "revision": null
  }, {
    "url": "assets/Sponsor-a8b1b3ff.css",
    "revision": null
  }, {
    "url": "assets/Sponsorship-005fcf13.css",
    "revision": null
  }, {
    "url": "assets/Sponsorship-2219dcdc.js",
    "revision": null
  }, {
    "url": "assets/Staff-6697bdfd.css",
    "revision": null
  }, {
    "url": "assets/Staff-9715c57a.js",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-66371c85.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-dc90f814.js",
    "revision": null
  }, {
    "url": "en/index.html",
    "revision": "8c126205ad406d7d905df384584ebf02"
  }, {
    "url": "en/landing.html",
    "revision": "8c126205ad406d7d905df384584ebf02"
  }, {
    "url": "en/landing/index.html",
    "revision": "8c126205ad406d7d905df384584ebf02"
  }, {
    "url": "en/map.html",
    "revision": "ab46d78d9d15bd7e27ebbeb9f2a8b29c"
  }, {
    "url": "en/map/index.html",
    "revision": "ab46d78d9d15bd7e27ebbeb9f2a8b29c"
  }, {
    "url": "en/sponsorship.html",
    "revision": "67c1d146159327fcb5a0326d76c9190d"
  }, {
    "url": "en/sponsorship/index.html",
    "revision": "67c1d146159327fcb5a0326d76c9190d"
  }, {
    "url": "index.html",
    "revision": "90085459f440e12b690472dc579ac75d"
  }, {
    "url": "zh-TW/index.html",
    "revision": "15e47dc2f474d240d5ebc13bd772d063"
  }, {
    "url": "zh-TW/landing.html",
    "revision": "15e47dc2f474d240d5ebc13bd772d063"
  }, {
    "url": "zh-TW/landing/index.html",
    "revision": "15e47dc2f474d240d5ebc13bd772d063"
  }, {
    "url": "zh-TW/map.html",
    "revision": "311f03310853006b36e21713af872869"
  }, {
    "url": "zh-TW/map/index.html",
    "revision": "311f03310853006b36e21713af872869"
  }, {
    "url": "zh-TW/sponsorship.html",
    "revision": "9359b4a4bf287a4a066fd4009fbe6a13"
  }, {
    "url": "zh-TW/sponsorship/index.html",
    "revision": "9359b4a4bf287a4a066fd4009fbe6a13"
  }, {
    "url": "favicon.svg",
    "revision": "481a70df0b95472a1f4b2223c1a6b8f5"
  }, {
    "url": "manifest.webmanifest",
    "revision": "17caa39038465cd3c2f42cf70eccd808"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
    denylist: [/.*\.(jpg|png|svg|json|js|xml|pdf)$/]
  }));
  workbox.registerRoute(/^https:\/\/script\.google\.com\/.*/i, new workbox.NetworkFirst({
    "cacheName": "room-status-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 2,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200, 301]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/coscup\.org\/2023\/json\/.*/i, new workbox.NetworkFirst({
    "cacheName": "json-data-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 432000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200, 301]
    })]
  }), 'GET');
  workbox.initialize({});

}));
