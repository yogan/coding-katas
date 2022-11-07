import { stdin } from 'node:process'
import { visualize } from './field-visualizer.mjs'
import { calculateNextGeneration } from './game-of-life.mjs'

const ctrlC = '\u0003'
const delay = 200

const glider = new Set([
    { x: 0, y: 2 },
    { x: 1, y: 0 }, { x: 1, y: 2 },
    { x: 2, y: 1 }, { x: 2, y: 2 },
])

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf-8')

stdin.on('data', (buffer) => {
    const key = String(buffer)
    if (key === ctrlC || key.trim().toLowerCase() === 'q') {
        process.exit()
    }
})

var field = new Set(glider)
var iteration = 0

while(true) {
    console.clear()
    console.log('Press Ctrl+C or q at any time to quit.')
    console.log(`Iteration ${iteration++}`)
    console.log()
    console.log(visualize(field))

    field = calculateNextGeneration(field)

    await sleep(delay)
}
