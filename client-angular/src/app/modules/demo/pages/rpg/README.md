# RPG Demo

## Full List of Features for the RPG Demo

### Core Game Features

- Character creation and management
- Inventory management (add, remove, use items)
- Attribute/stat management (view, edit, level up)
- Game moments/scenes (narrative progression)
- Choices and branching paths
- Locations and movement
- Effects/status management (buffs, debuffs)
- Game saves (multiple slots, load/save/delete)
- Preferences/settings (difficulty, pronouns, blocked tags, etc.)
- Event log/history
- Tagging system (for items, moments, locations, etc.)

### Admin/Data Management Features

- CRUD for all static data:&nbsp; Attributes, Items, Moments, Locations, Tags
- Live editing of static data (in-memory, with future remote support)
- Data import/export (optional, for advanced users)

## Components

### Separation of Concerns

| Layer              | Does                                                                  |
| ------------------ | --------------------------------------------------------------------- |
| `GameDataService`  | Load static data (tags, locations, characters, etc.)                  |
| `GameStateService` | Handles the raw state and only used by facades or other services      |
| `GameFacade`       | Exposes high-level, UI-friendly properties and methods for game state |
| `GameSaveService`  | Used to save/load game state with localStorage                        |
| `ActionService`    | `attack`, `useItem`, `applyEffect`, `triggerMoment`, `gainXP`         |

### Game Facade

A facade is a great way to centralize logic for:

- Accessing and modifying current state
- Resolving references by ID (e.g. characterId → Character)
- Preparing for NgRx by abstracting selectors, dispatches, etc.
- Decoupling components from direct service or state access

Architecture uses normalized, ID-based references with a mix of mutable game state and immutable static data

#### Static vs Mutable Data

| Type    | Source             | Example                                       |
| ------- | ------------------ | --------------------------------------------- |
| Static  | `GameDataService`  | Items, Locations, Moments                     |
| Mutable | `GameStateService` | Characters, Inventory, History, Relationships |

In the facade, you bridge both by:

- Looking up dynamic IDs in `GameStateService`
- Resolving them into full data via `GameDataService`

#### Benefits of the Facade

- _Centralizes logic:_&nbsp; no scattered `JSON.parse()` or raw updates in components
- _Future-proof:_&nbsp; can later replace `GameStateService` with NgRx Store without changing component code
- _Composable:_&nbsp; actions like `useItem`, `triggerMoment`, `attackTarget` can live here or delegate to an `ActionService`
- _Easier Testing:_&nbsp; unit test logic without touching actual storage

### Game Save

The game will use `localStorage` (at first) to hold multiple named save states, each under a key like:&nbsp; `rpg-save-slot-{slotName}`

Each save will include:

- Serialized `GameState`
- Optional metadata: name, timestamp, size (computed)
- Autosave can be stored separately under: `rpg-autosave`

---

A clean separation as the app grows: data storage, game logic, and user-facing commands

| Responsibility | Service / Layer    | Examples                                             |
| -------------- | ------------------ | ---------------------------------------------------- |
| State storage  | `GameStateService` | Load/save to `localStorage`, restore state           |
| Game logic     | `ActionService`    | `attack`, `useItem`, `applyEffect`, `triggerMoment`  |
| State access   | `GameFacade`       | `getCharacterById`, `updateCharacter`, `getItemById` |

So those `applyEffect`, `useItem`, `initializeCharacter`, etc. belong in `ActionService`, which uses the `GameFacade` and `GameStateService` underneath.

This way, **state is just state** — no logic.
