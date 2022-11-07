export type Cell = { x: number; y: number }
export type CellState = 'Dead' | 'Alive'
export type Field = Set<Cell>
export type NumberOfNeighbors = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8


export const getNextCellState = (
    state: CellState,
    numberOfNeighbors: NumberOfNeighbors
): CellState => {
    if (numberOfNeighbors == 2) return state
    if (numberOfNeighbors == 3) return 'Alive'
    return 'Dead'
}


export const getNeighborCandidates = ({ x, y }: Cell): Field =>
    new Set([
        { x: x - 1, y: y - 1 }, { x: x - 1, y: y }, { x: x - 1, y: y + 1 },
        { x: x + 0, y: y - 1 }, /*               */ { x: x + 0, y: y + 1 },
        { x: x + 1, y: y - 1 }, { x: x + 1, y: y }, { x: x + 1, y: y + 1 },
    ])


export const countNeighbors = (field: Field, cell: Cell): NumberOfNeighbors => {
    const numberOfNeighbors = [...getNeighborCandidates(cell)]
        .map(candidate => containsCell(field, candidate))
        .reduce((acc, b) => acc + (b ? 1 : 0), 0)

    if (isNeighborNumber(numberOfNeighbors)) { return numberOfNeighbors }
    throw Error(`invalid number of neighbors (${numberOfNeighbors})`)
}

// We need to do it like that, as Set.prototype.has() checks by reference, so
// passing a cell as a new object to has() would never find anything in the Set.
// Same thing for Array.prototype.includes(). What does work, however, is
// Array.prototype.find() with a custom compare function that checks by value.
export const containsCell = (field: Field, cell: Cell): boolean =>
    [...field].find(candidate => compareCells(cell, candidate)) !== undefined

const compareCells = (left: Cell, right: Cell): boolean =>
    left.x === right.x &&
    left.y === right.y

const isNeighborNumber = (num: number): num is NumberOfNeighbors =>
    num >= 0 && num <= 8


export const getCellsThatCanChange = (field: Field): Field => {
    const newCells = new Set<Cell>(field)

    field.forEach(cell => {
        getNeighborCandidates(cell).forEach(neighbor => {
            if (!containsCell(newCells, neighbor)) {
                newCells.add(neighbor)
            }
        })
    })

    return newCells
}

export const calculateNextGeneration = (field: Field): Field => {
    const newCells = new Set<Cell>()

    getCellsThatCanChange(field).forEach(cell => {
        const neighbors = countNeighbors(field, cell)
        const state = containsCell(field, cell) ? 'Alive' : 'Dead'
        if (getNextCellState(state, neighbors) === 'Alive') {
            newCells.add(cell)
        }
    })

    return newCells
}