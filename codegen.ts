import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://api.thegraph.com/subgraphs/name/fedoken/dapppad-v2',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/types/graphql/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
