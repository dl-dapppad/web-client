import { ROUTE_NAMES, CATEGORIES_IDS } from '@/enums'

export const postsBackMap = {
  tokens: { name: ROUTE_NAMES.main },
  'erc20-tokens': {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.tokens },
  },
  'erc721-tokens': {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.tokens },
  },
  'erc20-base': {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc20Tokens },
  },
  'erc721-base': {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc721Tokens },
  },
}
