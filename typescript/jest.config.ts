import type { JestConfigWithTsJest } from 'ts-jest'
import { defaults } from 'jest-config'

const jestConfig: JestConfigWithTsJest = {
    preset: 'ts-jest/presets/default-esm',
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
    resolver: './mjs-resolver.ts',
    transform: {
        '^.+\\.m?[tj]sx?$': ['ts-jest', { useESM: true }]
    }
}

export default jestConfig