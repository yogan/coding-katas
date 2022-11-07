import { visualize } from "./field-visualizer.mjs"

describe("visualize()", () => {
    it("renders a field with a glider", () => {
        //     0 1 2 (x)
        //  0  . X .
        //  1  . . X
        //  2  X X X
        // (y)
        const glider = new Set([
            { x: 0, y: 2 },
            { x: 1, y: 0 }, { x: 1, y: 2 },
            { x: 2, y: 1 }, { x: 2, y: 2 },
        ])

        const printableField = visualize(glider)

        expect(printableField).toBe(
` . X . .
 . . X .
 X X X .
 . . . .
`)
    })

    it("does not render cells with negative coordinates", () => {
        //    -1 0 1 2 (x)
        // -1  X X .
        //  0  X . X .
        //  1  . . . X
        //  2  . X X X
        // (y)
        const glider = new Set([
            { x: -1, y: -1 }, { x: -1, y: 0 },
            { x: +0, y: -1 }, { x: +0, y: 2 },
            { x: +1, y: +0 }, { x: +1, y: 2 },
            { x: +2, y: +1 }, { x: +2, y: 2 },
        ])

        const printableField = visualize(glider)

        expect(printableField).toBe(
` . X . .
 . . X .
 X X X .
 . . . .
`)
    })
})