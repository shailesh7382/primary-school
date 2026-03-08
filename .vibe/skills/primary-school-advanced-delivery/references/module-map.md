# Primary School Module Map

## Modules

| Module | Port | Role | Key Files |
|---|---|---|---|
| `container` | `3000` | Shell, navigation, remote integration | `container/src/App.js`, `container/webpack.config.js` |
| `maths-science` | `3001` | Learning content remote | `maths-science/src/MathsScience.js`, `maths-science/webpack.config.js` |
| `exam` | `3002` | Exam remote | `exam/src/Exam.js`, `exam/webpack.config.js` |
| `student-records` | `3003` | Records remote | `student-records/src/StudentRecords.js`, `student-records/webpack.config.js` |

## Integration Boundaries

1. Container consumes remotes via Module Federation remotes config.
2. Each remote exposes a root component through `exposes`.
3. Shared dependencies (React/ReactDOM) must stay compatible across modules.
4. Routing and user-flow regressions usually surface first in container navigation.

## Build and Runtime Commands

### Root

- `npm run install:all`
- `npm run build:all`
- `npm run start:all`
- `npm run stop:all`
- `npm run check-status`

### Per Module

- `cd container && npm run build`
- `cd maths-science && npm run build`
- `cd exam && npm run build`
- `cd student-records && npm run build`

## High-Risk Change Areas

- Module Federation names, `remotes`, and `exposes`.
- Shared dependency versions and runtime assumptions.
- Route wiring and navigation states in `container`.
- Cross-module data assumptions (shape, nullability, IDs).
