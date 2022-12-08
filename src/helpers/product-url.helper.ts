export const makeProductPath = (product: string) => {
  return /-/.test(product) ? `${product.split('-')[0]}/${product}` : product
}
