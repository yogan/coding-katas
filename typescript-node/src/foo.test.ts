import { square } from "./foo"

describe("square()", () => {
    it("returns the square the given input", () => {
        expect(square(2)).toBe(4)
    })
})