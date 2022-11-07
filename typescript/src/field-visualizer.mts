import { containsCell, Field } from "./game-of-life.mjs"

export const visualize = (field: Field): string => {
    const cells = [...field]
    const xs = cells.map(cell => cell.x)
    const ys = cells.map(cell => cell.y)
    const [maxX, maxY] = [Math.max(...xs), Math.max(...ys)]
    const [cols, rows] = [maxX + 1, maxY + 1]

    var output = ''

    // We intentionally start at 0 and ignore cells with negative coordinates,
    // which are calculated and can therefore be contained in the field, but
    // rendering them would make the whole screen jump around every time a cell
    // reaches an "even more negative" position.
    // Using <= is also intentional to have an empty right and bottom border,
    // which just looks nicer than having cells at the border.
    for (var y = 0; y <= rows; y++) {
        var line = ''
        for (var x = 0; x <= cols; x++) {
            if (containsCell(field, { x, y })) {
                line += ' X'
            } else {
                line += ' .'
            }
        }
        output += `${line}\n`
    }

    return output
}