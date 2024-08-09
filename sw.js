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
    "url": "assets/app-a441c379.js",
    "revision": null
  }, {
    "url": "assets/banner-logo-6d7e2a97.js",
    "revision": null
  }, {
    "url": "assets/Community-202dc8ea.css",
    "revision": null
  }, {
    "url": "assets/community-24f11c66.js",
    "revision": null
  }, {
    "url": "assets/Community-d6ec8161.js",
    "revision": null
  }, {
    "url": "assets/Fringe-d4cb7907.css",
    "revision": null
  }, {
    "url": "assets/Fringe-ee531e0b.js",
    "revision": null
  }, {
    "url": "assets/Guide-5d38c1cd.css",
    "revision": null
  }, {
    "url": "assets/Guide-f710b5fa.js",
    "revision": null
  }, {
    "url": "assets/Home-721cfe03.js",
    "revision": null
  }, {
    "url": "assets/Home-c788c6f6.css",
    "revision": null
  }, {
    "url": "assets/index-8f9aff1a.css",
    "revision": null
  }, {
    "url": "assets/Landing-64fdded0.js",
    "revision": null
  }, {
    "url": "assets/Landing-95486dc0.css",
    "revision": null
  }, {
    "url": "assets/Map-7c7337de.js",
    "revision": null
  }, {
    "url": "assets/Map-bedb3288.css",
    "revision": null
  }, {
    "url": "assets/Room-49d52900.css",
    "revision": null
  }, {
    "url": "assets/Room-d3ea1faa.js",
    "revision": null
  }, {
    "url": "assets/Session-42a79214.css",
    "revision": null
  }, {
    "url": "assets/session-a3301b2f.js",
    "revision": null
  }, {
    "url": "assets/Session-c4222844.js",
    "revision": null
  }, {
    "url": "assets/Sponsor-a8b1b3ff.css",
    "revision": null
  }, {
    "url": "assets/Sponsor-c95060e9.js",
    "revision": null
  }, {
    "url": "assets/Sponsorship-005fcf13.css",
    "revision": null
  }, {
    "url": "assets/Sponsorship-b15bbf96.js",
    "revision": null
  }, {
    "url": "assets/Staff-6697bdfd.css",
    "revision": null
  }, {
    "url": "assets/Staff-eefad3f3.js",
    "revision": null
  }, {
    "url": "assets/Topics-34ac06ed.css",
    "revision": null
  }, {
    "url": "assets/Topics-9fe63c6c.js",
    "revision": null
  }, {
    "url": "assets/Venue-22ff17b8.js",
    "revision": null
  }, {
    "url": "assets/Venue-da55703e.css",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-aadf5e48.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-dc90f814.js",
    "revision": null
  }, {
    "url": "en/community.html",
    "revision": "d0ebf626f6b3a28e53bcb7ccabdfe853"
  }, {
    "url": "en/community/index.html",
    "revision": "600f490bfbb8c23c74b2ac10c334cdc5"
  }, {
    "url": "en/fringe.html",
    "revision": "3994cbdb3e1f115cab5e98a81adbdf0e"
  }, {
    "url": "en/fringe/index.html",
    "revision": "3994cbdb3e1f115cab5e98a81adbdf0e"
  }, {
    "url": "en/index.html",
    "revision": "724db0358229f145c208f755e89c0c1e"
  }, {
    "url": "en/landing.html",
    "revision": "dc1ed44440657bfdce3c4a34d5ac96ec"
  }, {
    "url": "en/landing/index.html",
    "revision": "dc1ed44440657bfdce3c4a34d5ac96ec"
  }, {
    "url": "en/map.html",
    "revision": "f9c95c9ac91524abb7059865e79d4db2"
  }, {
    "url": "en/map/index.html",
    "revision": "f9c95c9ac91524abb7059865e79d4db2"
  }, {
    "url": "en/room.html",
    "revision": "455c6edda6817ce567b32c0162d3da2e"
  }, {
    "url": "en/room/index.html",
    "revision": "455c6edda6817ce567b32c0162d3da2e"
  }, {
    "url": "en/session.html",
    "revision": "ba4429442ed169d7a7b61409cdc1f2ce"
  }, {
    "url": "en/sponsor.html",
    "revision": "22b63838801571b969e331d235abc185"
  }, {
    "url": "en/sponsor/index.html",
    "revision": "22b63838801571b969e331d235abc185"
  }, {
    "url": "en/sponsorship.html",
    "revision": "752e47488db852afa4e56ad2c9394ee8"
  }, {
    "url": "en/sponsorship/index.html",
    "revision": "752e47488db852afa4e56ad2c9394ee8"
  }, {
    "url": "en/staff.html",
    "revision": "323af5b13a66f24b14cf256b05263576"
  }, {
    "url": "en/staff/index.html",
    "revision": "323af5b13a66f24b14cf256b05263576"
  }, {
    "url": "en/venue.html",
    "revision": "2d5706db3193f4b852879217ca8fcd7d"
  }, {
    "url": "en/venue/index.html",
    "revision": "2d5706db3193f4b852879217ca8fcd7d"
  }, {
    "url": "index.html",
    "revision": "0ff716faf6faa7f1b5290ac8fae35cd8"
  }, {
    "url": "zh-TW/community.html",
    "revision": "1c9ce63fadd44981a3c49bdffa3c00c2"
  }, {
    "url": "zh-TW/community/index.html",
    "revision": "9614ae6d3410354e03e7c7dcaccfbe08"
  }, {
    "url": "zh-TW/fringe.html",
    "revision": "bc6e3243829641b767ace97e0a41ecff"
  }, {
    "url": "zh-TW/fringe/index.html",
    "revision": "bc6e3243829641b767ace97e0a41ecff"
  }, {
    "url": "zh-TW/index.html",
    "revision": "3b7c3137a9fca8300dac142297b4d500"
  }, {
    "url": "zh-TW/landing.html",
    "revision": "3edf89c533f6bbe163855f6c53df67f3"
  }, {
    "url": "zh-TW/landing/index.html",
    "revision": "3edf89c533f6bbe163855f6c53df67f3"
  }, {
    "url": "zh-TW/map.html",
    "revision": "51a58397b49cc29ad761df2074c1f1ca"
  }, {
    "url": "zh-TW/map/index.html",
    "revision": "51a58397b49cc29ad761df2074c1f1ca"
  }, {
    "url": "zh-TW/room.html",
    "revision": "dab16710fe9269d2d315a6180c7a6062"
  }, {
    "url": "zh-TW/room/index.html",
    "revision": "dab16710fe9269d2d315a6180c7a6062"
  }, {
    "url": "zh-TW/session.html",
    "revision": "61ed7769ff8a68d765232028323dd3d4"
  }, {
    "url": "zh-TW/sponsor.html",
    "revision": "afb8b8804072daf4b1bcc77371dd2d62"
  }, {
    "url": "zh-TW/sponsor/index.html",
    "revision": "afb8b8804072daf4b1bcc77371dd2d62"
  }, {
    "url": "zh-TW/sponsorship.html",
    "revision": "b380f41de8b069d8834684f166e6fef0"
  }, {
    "url": "zh-TW/sponsorship/index.html",
    "revision": "b380f41de8b069d8834684f166e6fef0"
  }, {
    "url": "zh-TW/staff.html",
    "revision": "a1a734d3a2369710b1146faf75811c0b"
  }, {
    "url": "zh-TW/staff/index.html",
    "revision": "a1a734d3a2369710b1146faf75811c0b"
  }, {
    "url": "zh-TW/venue.html",
    "revision": "1c211f5ea71be42a8638253dfd6e923c"
  }, {
    "url": "zh-TW/venue/index.html",
    "revision": "1c211f5ea71be42a8638253dfd6e923c"
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
  workbox.registerRoute(/^https:\/\/coscup\.org\/2024\/json\/.*/i, new workbox.NetworkFirst({
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
