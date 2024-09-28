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
    "url": "assets/app-88ab910e.js",
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
    "url": "assets/Community-55dde2c7.js",
    "revision": null
  }, {
    "url": "assets/Fringe-2c79f893.js",
    "revision": null
  }, {
    "url": "assets/Fringe-d4cb7907.css",
    "revision": null
  }, {
    "url": "assets/Guide-497bbd4f.js",
    "revision": null
  }, {
    "url": "assets/Guide-5d38c1cd.css",
    "revision": null
  }, {
    "url": "assets/Home-c788c6f6.css",
    "revision": null
  }, {
    "url": "assets/Home-e718562d.js",
    "revision": null
  }, {
    "url": "assets/index-8f9aff1a.css",
    "revision": null
  }, {
    "url": "assets/Landing-95486dc0.css",
    "revision": null
  }, {
    "url": "assets/Landing-e911cb3e.js",
    "revision": null
  }, {
    "url": "assets/Map-402ff5f1.js",
    "revision": null
  }, {
    "url": "assets/Map-bedb3288.css",
    "revision": null
  }, {
    "url": "assets/Room-49d52900.css",
    "revision": null
  }, {
    "url": "assets/Room-c1d54acd.js",
    "revision": null
  }, {
    "url": "assets/session-0757180c.js",
    "revision": null
  }, {
    "url": "assets/Session-89eb02c3.css",
    "revision": null
  }, {
    "url": "assets/Session-c6e608ea.js",
    "revision": null
  }, {
    "url": "assets/Sponsor-6d2866c3.js",
    "revision": null
  }, {
    "url": "assets/Sponsor-a8b1b3ff.css",
    "revision": null
  }, {
    "url": "assets/Sponsorship-005fcf13.css",
    "revision": null
  }, {
    "url": "assets/Sponsorship-77442bf8.js",
    "revision": null
  }, {
    "url": "assets/Staff-6697bdfd.css",
    "revision": null
  }, {
    "url": "assets/Staff-ba8df894.js",
    "revision": null
  }, {
    "url": "assets/Topics-34ac06ed.css",
    "revision": null
  }, {
    "url": "assets/Topics-d8c2e2fa.js",
    "revision": null
  }, {
    "url": "assets/Venue-350d3c30.js",
    "revision": null
  }, {
    "url": "assets/Venue-da55703e.css",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-c0e71201.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-dc90f814.js",
    "revision": null
  }, {
    "url": "en/community.html",
    "revision": "80b8f8c46dc7660393f3d83cec5f9b0d"
  }, {
    "url": "en/community/index.html",
    "revision": "291c21c9b07a8cba863ec797371d307a"
  }, {
    "url": "en/fringe.html",
    "revision": "9d66a687d82752fd1daf6eb1c4519e76"
  }, {
    "url": "en/fringe/index.html",
    "revision": "9d66a687d82752fd1daf6eb1c4519e76"
  }, {
    "url": "en/index.html",
    "revision": "52a730c6599d631e141e05d1da1fb5e9"
  }, {
    "url": "en/landing.html",
    "revision": "7ae069df37b15ef190615802afdd6c44"
  }, {
    "url": "en/landing/index.html",
    "revision": "7ae069df37b15ef190615802afdd6c44"
  }, {
    "url": "en/map.html",
    "revision": "683fccc91d5559c038a8ff24bfa97fe5"
  }, {
    "url": "en/map/index.html",
    "revision": "683fccc91d5559c038a8ff24bfa97fe5"
  }, {
    "url": "en/room.html",
    "revision": "ccaf464181d398b14c0d4fa2fbd62a75"
  }, {
    "url": "en/room/index.html",
    "revision": "ccaf464181d398b14c0d4fa2fbd62a75"
  }, {
    "url": "en/session.html",
    "revision": "9d625bccf48fc7376e3bf7eda39662e3"
  }, {
    "url": "en/sponsor.html",
    "revision": "d694cf2ea3650f6ccbfc2b86eca4bbf4"
  }, {
    "url": "en/sponsor/index.html",
    "revision": "d694cf2ea3650f6ccbfc2b86eca4bbf4"
  }, {
    "url": "en/sponsorship.html",
    "revision": "9d27c5cf02454b0ffa3aacee96cae0aa"
  }, {
    "url": "en/sponsorship/index.html",
    "revision": "9d27c5cf02454b0ffa3aacee96cae0aa"
  }, {
    "url": "en/staff.html",
    "revision": "2c56d32778d0c0c933b3fd2b7439aab4"
  }, {
    "url": "en/staff/index.html",
    "revision": "2c56d32778d0c0c933b3fd2b7439aab4"
  }, {
    "url": "en/venue.html",
    "revision": "d35349aad46a456e2eeab0c66ec2ebe0"
  }, {
    "url": "en/venue/index.html",
    "revision": "d35349aad46a456e2eeab0c66ec2ebe0"
  }, {
    "url": "index.html",
    "revision": "b2523b1485390bd632b27aa119a629a1"
  }, {
    "url": "zh-TW/community.html",
    "revision": "5cff18162b8105a6ae2c78de57a098c3"
  }, {
    "url": "zh-TW/community/index.html",
    "revision": "d5350217cfbe472e8f3cd3533c80e033"
  }, {
    "url": "zh-TW/fringe.html",
    "revision": "60b6aab16f67811727174be31be5431d"
  }, {
    "url": "zh-TW/fringe/index.html",
    "revision": "60b6aab16f67811727174be31be5431d"
  }, {
    "url": "zh-TW/index.html",
    "revision": "df394a86985bc200390ee47c12e7962b"
  }, {
    "url": "zh-TW/landing.html",
    "revision": "9db319a5bd9b444037a71883faa1a17b"
  }, {
    "url": "zh-TW/landing/index.html",
    "revision": "9db319a5bd9b444037a71883faa1a17b"
  }, {
    "url": "zh-TW/map.html",
    "revision": "b9c22d4ef94b8825e174f526ac7a9732"
  }, {
    "url": "zh-TW/map/index.html",
    "revision": "b9c22d4ef94b8825e174f526ac7a9732"
  }, {
    "url": "zh-TW/room.html",
    "revision": "0801f7a38ce94f33c6485383adc78278"
  }, {
    "url": "zh-TW/room/index.html",
    "revision": "0801f7a38ce94f33c6485383adc78278"
  }, {
    "url": "zh-TW/session.html",
    "revision": "afd9430cc2bbbe9b56b8fbe300f9fa87"
  }, {
    "url": "zh-TW/sponsor.html",
    "revision": "6994f890753add3da1b3d9c49485749f"
  }, {
    "url": "zh-TW/sponsor/index.html",
    "revision": "6994f890753add3da1b3d9c49485749f"
  }, {
    "url": "zh-TW/sponsorship.html",
    "revision": "d5d58cff1ab23a38bcd3f82aeca3f31b"
  }, {
    "url": "zh-TW/sponsorship/index.html",
    "revision": "d5d58cff1ab23a38bcd3f82aeca3f31b"
  }, {
    "url": "zh-TW/staff.html",
    "revision": "b6d9f0840d31188e164300606b042d8b"
  }, {
    "url": "zh-TW/staff/index.html",
    "revision": "b6d9f0840d31188e164300606b042d8b"
  }, {
    "url": "zh-TW/venue.html",
    "revision": "5c18be3068e6c65eb83a4a0d1355396f"
  }, {
    "url": "zh-TW/venue/index.html",
    "revision": "5c18be3068e6c65eb83a4a0d1355396f"
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
