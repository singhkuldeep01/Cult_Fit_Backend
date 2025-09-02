// prisma.config.ts

export default {
  schema: 'prisma/schema.prisma', // path to your schema

  generator: {
    client: {
      provider: 'prisma-client-js', // default
    },
  },

  seed: {
    run: 'ts-node prisma/seed.ts', // keeps your existing seed
  },
}
