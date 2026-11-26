#!/usr/bin/env node
// GitHub Pages publishes the repository root for this repo, so the built app is
// copied next to the sources. The dev entry lives in dev.html and is not copied.
import { copyFile, cp, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const dist = path.join(projectRoot, 'dist')

const html = await readFile(path.join(dist, 'dev.html'), 'utf8')
await writeFile(path.join(dist, 'index.html'), html)
await writeFile(path.join(projectRoot, 'index.html'), html)

await rm(path.join(projectRoot, 'assets'), { recursive: true, force: true })
await cp(path.join(dist, 'assets'), path.join(projectRoot, 'assets'), { recursive: true })

await copyFile(path.join(dist, 'index.html'), path.join(projectRoot, 'index.html'))
await rm(path.join(dist, 'dev.html'), { force: true })

console.log('pages: index.html and assets/ updated at the repository root')
