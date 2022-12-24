import { RouteLocationRaw } from 'vue-router'
import { PRODUCT_IDS, ROUTE_NAMES, CATEGORIES_IDS } from '@/enums'

export const routeBackMap = {
  [CATEGORIES_IDS.tokens]: { name: ROUTE_NAMES.main },
  [CATEGORIES_IDS.erc20Tokens]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.tokens },
  } as RouteLocationRaw,
  [CATEGORIES_IDS.erc721Tokens]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc20Base]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc20Tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc20Mint]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc20Tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc20Burn]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc20Tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc20MintBurn]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc20Tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc20MintBurnCap]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc20Tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc20MintCap]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc20Tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc721Base]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc721Tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc721Enum]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc721Tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc721Burn]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc721Tokens },
  } as RouteLocationRaw,
  [PRODUCT_IDS.erc721BurnEnum]: {
    name: ROUTE_NAMES.categories,
    params: { id: CATEGORIES_IDS.erc721Tokens },
  } as RouteLocationRaw,
} as Record<string, RouteLocationRaw>
