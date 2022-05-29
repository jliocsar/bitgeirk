# ⚡ Bitgeirk

A tiny & fast database written in TypeScript.

🏗️ Under construction 🚧

## 📜 Requirements

- Rust 1.50.0
- wasm-bindgen 0.2.61
- [wasmedge-core dependencies](https://github.com/second-state/wasmedge-core#for-ubuntu-2004)

## 🦔 Engine Example

```ts
import { DatabaseEngine } from '@bitgeirk/database'

;(async () => {
  const engine = new DatabaseEngine()

  // For reading operations:
  // const results = await engine.read()
  // console.log(results.length)

  // An example of writing operations:
  try {
    await engine.write(
      Array.from({ length: 100_000 }).fill({
        name: 'John',
        age: 30,
        friends: Array.from({ length: 5 }).fill({
          name: 'Jane',
          age: 25,
        }),
      }),
    )
  } catch (error) {
    console.log({ error })
  }
})()
```

## 🦑 Client Example

```ts
import { Client } from '@bitgeirk/client'

;(async () => {
  const client = new Client()
  const test = await client.getCollection('test')
  const documents = await test.findAll()
  console.log(documents.length)
})()
```

## To do

- [ ] Validate `writeData` types before stringifying it ([here](./lib/engine/database/database-engine.ts#L71))
- [ ] Create server/client integration using [tRPC](https://trpc.io/)
- [ ] Add caching layer for reading
