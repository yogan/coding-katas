import { countNeighbors, getNeighborCandidates, getNextCellState } from "./game-of-life"

describe("getNextCellState()", () => {
    it("returns whatever the game of life rules say", () => {
        expect(getNextCellState('Alive', 1)).toBe('Dead')
        expect(getNextCellState('Alive', 2)).toBe('Alive')
        expect(getNextCellState('Alive', 3)).toBe('Alive')
        expect(getNextCellState('Alive', 4)).toBe('Dead')

        expect(getNextCellState('Dead', 0)).toBe('Dead')
        expect(getNextCellState('Dead', 1)).toBe('Dead')
        expect(getNextCellState('Dead', 2)).toBe('Dead')
        expect(getNextCellState('Dead', 3)).toBe('Alive')
        expect(getNextCellState('Dead', 4)).toBe('Dead')
    })
})

describe("getNeighborCandidates()", () => {
    it("returns a set of cells around the given cell", () => {
        const candidates = getNeighborCandidates({ x: 0, y: 0 })
        expect(candidates).toEqual(new Set([
            { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
            { x: +0, y: -1 }, /*            */ { x: +0, y: 1 },
            { x: +1, y: -1 }, { x: +1, y: 0 }, { x: +1, y: 1 },
        ]))
    })
})

describe("countNeighbors()", () => {
    it("works for a field with a single cell", () => {
        const field = new Set([{ x: 1, y: 1 }])

        expect(countNeighbors(field, { x: 1, y: 1 })).toBe(0)
        expect(countNeighbors(field, { x: 0, y: 5 })).toBe(0)
        expect(countNeighbors(field, { x: 0, y: 0 })).toBe(1)
    })

    it("works for a field with many cells", () => {
        //     0 1 2 3 4 (x)
        //  0  . . . . .
        //  1  . X X . .
        //  2  . X X . .
        //  3  . . X X .
        //  4  . . . . .
        // (y)
        const field = new Set([
            { x: 1, y: 1 }, { x: 1, y: 2 },
            { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 },
            { x: 3, y: 3 },
        ])

        expect(countNeighbors(field, { x: 0, y: 0 })).toBe(1)
        expect(countNeighbors(field, { x: 0, y: 1 })).toBe(2)
        expect(countNeighbors(field, { x: 1, y: 1 })).toBe(3)
        expect(countNeighbors(field, { x: 2, y: 2 })).toBe(5)
        expect(countNeighbors(field, { x: 3, y: 3 })).toBe(2)
    })
})