import { calculateNextGeneration, Cell, countNeighbors, getCellsThatCanChange, getNeighborCandidates, getNextCellState } from "./game-of-life"

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

describe("getCellsThatCanChange() returns cells that might change in the next generation", () => {
    it("for an empty field", () => {
        const emptyField = new Set<Cell>()

        const cells = getCellsThatCanChange(emptyField)

        expect([...cells]).toHaveLength(0)
    })

    it("for a field with a single cell", () => {
        const field = new Set([{ x: 0, y: 3 }])

        const cells = getCellsThatCanChange(field)

        expect(cells).toEqual(new Set([
            { x: -1, y: 2 }, { x: -1, y: 3 }, { x: -1, y: 4 },
            { x: +0, y: 2 }, { x: +0, y: 3 }, { x: +0, y: 4 },
            { x: +1, y: 2 }, { x: +1, y: 3 }, { x: +1, y: 4 },
        ]))
    })

    it("for a field with multiple cells", () => {
        //     0 1 2 3 4 5 (x)
        //  0  . . . X . .
        //  1  . X . . . .
        //  2  . . X X X .
        //  3  . . . . . .
        // (y)
        const field = new Set([
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 0 }, { x: 3, y: 2 },
            { x: 4, y: 2 },
        ])
        //     0 1 2 3 4 5 (x)
        // -1  . . o o o .
        //  0  o o o X o .
        //  1  o X o o o o
        //  2  o o X X X o
        //  3  . o o o o o
        // (y)
        const expected = new Set([
            { x: 0, y: +0 }, { x: 0, y: 1 }, { x: 0, y: 2 },
            { x: 1, y: +0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
            { x: 2, y: -1 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 },
            { x: 3, y: -1 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 },
            { x: 4, y: -1 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 },
            { x: 5, y: +1 }, { x: 5, y: 2 }, { x: 5, y: 3 },
        ])

        const cells = getCellsThatCanChange(field)

        expect(cells).toEqual(expected)
    })
})

describe("calculateNextGeneration() returns the next generation", () => {
    it("for an empty field", () => {
        const emptyField = new Set<Cell>()

        const nextGeneration = calculateNextGeneration(emptyField)

        expect([...nextGeneration]).toHaveLength(0)
    })

    it("for three cells that evolve into a stable block", () => {
        const initial = new Set([
            { x: 1, y: 1 },
            { x: 2, y: 1 }, { x: 2, y: 2 },
        ])

        const generation1 = calculateNextGeneration(initial)

        expect(generation1).toEqual(new Set([
            { x: 1, y: 1 }, { x: 1, y: 2 },
            { x: 2, y: 1 }, { x: 2, y: 2 },
        ]))

        const generation2 = calculateNextGeneration(generation1)

        expect(generation2).toEqual(new Set([
            { x: 1, y: 1 }, { x: 1, y: 2 },
            { x: 2, y: 1 }, { x: 2, y: 2 },
        ]))
    })

    it("for a glider", () => {
        //     0 1 2 3 (x)
        //  0  . X . .
        //  1  . . X .
        //  2  X X X .
        //  3  . . . .
        // (y)
        const gliderInitial = new Set([
            { x: 0, y: 2 },
            { x: 1, y: 0 }, { x: 1, y: 2 },
            { x: 2, y: 1 }, { x: 2, y: 2 },
        ])
        //     0 1 2 3 (x)
        //  0  . . . .
        //  1  X . X .
        //  2  . X X .
        //  3  . X . .
        // (y)
        const gliderStep1 = new Set([
            { x: 0, y: 1 },
            { x: 1, y: 2 }, { x: 1, y: 3 },
            { x: 2, y: 1 }, { x: 2, y: 2 },
        ])
        //     0 1 2 3 (x)
        //  0  . . . .
        //  1  . . X .
        //  2  X . X .
        //  3  . X X .
        // (y)
        const gliderStep2 = new Set([
            { x: 0, y: 2 },
            { x: 1, y: 3 },
            { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 },
        ])
        //     0 1 2 3 (x)
        //  0  . . . .
        //  1  . X . .
        //  2  . . X X
        //  3  . X X .
        // (y)
        const gliderStep3 = new Set([
            { x: 1, y: 1 }, { x: 1, y: 3 },
            { x: 2, y: 2 }, { x: 2, y: 3 },
            { x: 3, y: 2 },
        ])

        const generation1 = calculateNextGeneration(gliderInitial)
        expect(generation1).toEqual(gliderStep1)

        const generation2 = calculateNextGeneration(generation1)
        expect(generation2).toEqual(gliderStep2)

        const generation3 = calculateNextGeneration(generation2)
        expect(generation3).toEqual(gliderStep3)
    })
})