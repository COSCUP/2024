// Copyright (c) 2021 DevilTea
//           (c) 2024 Riley Ho
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { cpSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const currentScriptDir = dirname(fileURLToPath(import.meta.url)) // Get the directory of the current script file
const distDir = join(currentScriptDir, '../../dist/') // Get the absolute path of the dist directory

cpSync(
  join(distDir, 'zh-TW/'),
  distDir,
  {
    recursive: true,
    force: true
  }
)

cpSync(
  join(distDir, 'index.html'),
  join(distDir, '404.html'),
  { force: true }
)
