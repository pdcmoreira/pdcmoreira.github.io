# cv-quest

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## TODO

### Features

- Game screens (main menu, gameplay, end screen)
- Gameplay state
  - Free
  - Locked (for running dialogue, scripts, etc), which limits user input (ex: "next line of dialogue")
- Player sprites, animated according to movement
- Action keys 

## Bugs

- Force releasing active keys when window loses focus