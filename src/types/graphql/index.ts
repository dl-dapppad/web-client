import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PaymentToken = {
  __typename?: 'PaymentToken';
  id: Scalars['Bytes'];
};

export type PaymentToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PaymentToken_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<PaymentToken_Filter>>>;
};

export enum PaymentToken_OrderBy {
  Id = 'id'
}

export type ProductCounter = {
  __typename?: 'ProductCounter';
  id: Scalars['Bytes'];
  productSalesCount: Scalars['BigInt'];
  usersBought: Scalars['BigInt'];
};

export type ProductCounter_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProductCounter_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<ProductCounter_Filter>>>;
  productSalesCount?: InputMaybe<Scalars['BigInt']>;
  productSalesCount_gt?: InputMaybe<Scalars['BigInt']>;
  productSalesCount_gte?: InputMaybe<Scalars['BigInt']>;
  productSalesCount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  productSalesCount_lt?: InputMaybe<Scalars['BigInt']>;
  productSalesCount_lte?: InputMaybe<Scalars['BigInt']>;
  productSalesCount_not?: InputMaybe<Scalars['BigInt']>;
  productSalesCount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  usersBought?: InputMaybe<Scalars['BigInt']>;
  usersBought_gt?: InputMaybe<Scalars['BigInt']>;
  usersBought_gte?: InputMaybe<Scalars['BigInt']>;
  usersBought_in?: InputMaybe<Array<Scalars['BigInt']>>;
  usersBought_lt?: InputMaybe<Scalars['BigInt']>;
  usersBought_lte?: InputMaybe<Scalars['BigInt']>;
  usersBought_not?: InputMaybe<Scalars['BigInt']>;
  usersBought_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum ProductCounter_OrderBy {
  Id = 'id',
  ProductSalesCount = 'productSalesCount',
  UsersBought = 'usersBought'
}

export type ProductSale = {
  __typename?: 'ProductSale';
  id: Scalars['Bytes'];
  initialPrice: Scalars['BigInt'];
  paymentPrice: Scalars['BigInt'];
  paymentToken: Scalars['Bytes'];
  points: Scalars['BigInt'];
  productProxyAddress: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  userToProduct: UserToProduct;
};

export type ProductSale_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProductSale_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  initialPrice?: InputMaybe<Scalars['BigInt']>;
  initialPrice_gt?: InputMaybe<Scalars['BigInt']>;
  initialPrice_gte?: InputMaybe<Scalars['BigInt']>;
  initialPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialPrice_lt?: InputMaybe<Scalars['BigInt']>;
  initialPrice_lte?: InputMaybe<Scalars['BigInt']>;
  initialPrice_not?: InputMaybe<Scalars['BigInt']>;
  initialPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<ProductSale_Filter>>>;
  paymentPrice?: InputMaybe<Scalars['BigInt']>;
  paymentPrice_gt?: InputMaybe<Scalars['BigInt']>;
  paymentPrice_gte?: InputMaybe<Scalars['BigInt']>;
  paymentPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  paymentPrice_lt?: InputMaybe<Scalars['BigInt']>;
  paymentPrice_lte?: InputMaybe<Scalars['BigInt']>;
  paymentPrice_not?: InputMaybe<Scalars['BigInt']>;
  paymentPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  paymentToken?: InputMaybe<Scalars['Bytes']>;
  paymentToken_contains?: InputMaybe<Scalars['Bytes']>;
  paymentToken_gt?: InputMaybe<Scalars['Bytes']>;
  paymentToken_gte?: InputMaybe<Scalars['Bytes']>;
  paymentToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  paymentToken_lt?: InputMaybe<Scalars['Bytes']>;
  paymentToken_lte?: InputMaybe<Scalars['Bytes']>;
  paymentToken_not?: InputMaybe<Scalars['Bytes']>;
  paymentToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  paymentToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  points?: InputMaybe<Scalars['BigInt']>;
  points_gt?: InputMaybe<Scalars['BigInt']>;
  points_gte?: InputMaybe<Scalars['BigInt']>;
  points_in?: InputMaybe<Array<Scalars['BigInt']>>;
  points_lt?: InputMaybe<Scalars['BigInt']>;
  points_lte?: InputMaybe<Scalars['BigInt']>;
  points_not?: InputMaybe<Scalars['BigInt']>;
  points_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  productProxyAddress?: InputMaybe<Scalars['Bytes']>;
  productProxyAddress_contains?: InputMaybe<Scalars['Bytes']>;
  productProxyAddress_gt?: InputMaybe<Scalars['Bytes']>;
  productProxyAddress_gte?: InputMaybe<Scalars['Bytes']>;
  productProxyAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  productProxyAddress_lt?: InputMaybe<Scalars['Bytes']>;
  productProxyAddress_lte?: InputMaybe<Scalars['Bytes']>;
  productProxyAddress_not?: InputMaybe<Scalars['Bytes']>;
  productProxyAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  productProxyAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  userToProduct?: InputMaybe<Scalars['String']>;
  userToProduct_?: InputMaybe<UserToProduct_Filter>;
  userToProduct_contains?: InputMaybe<Scalars['String']>;
  userToProduct_contains_nocase?: InputMaybe<Scalars['String']>;
  userToProduct_ends_with?: InputMaybe<Scalars['String']>;
  userToProduct_ends_with_nocase?: InputMaybe<Scalars['String']>;
  userToProduct_gt?: InputMaybe<Scalars['String']>;
  userToProduct_gte?: InputMaybe<Scalars['String']>;
  userToProduct_in?: InputMaybe<Array<Scalars['String']>>;
  userToProduct_lt?: InputMaybe<Scalars['String']>;
  userToProduct_lte?: InputMaybe<Scalars['String']>;
  userToProduct_not?: InputMaybe<Scalars['String']>;
  userToProduct_not_contains?: InputMaybe<Scalars['String']>;
  userToProduct_not_contains_nocase?: InputMaybe<Scalars['String']>;
  userToProduct_not_ends_with?: InputMaybe<Scalars['String']>;
  userToProduct_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  userToProduct_not_in?: InputMaybe<Array<Scalars['String']>>;
  userToProduct_not_starts_with?: InputMaybe<Scalars['String']>;
  userToProduct_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  userToProduct_starts_with?: InputMaybe<Scalars['String']>;
  userToProduct_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum ProductSale_OrderBy {
  Id = 'id',
  InitialPrice = 'initialPrice',
  PaymentPrice = 'paymentPrice',
  PaymentToken = 'paymentToken',
  Points = 'points',
  ProductProxyAddress = 'productProxyAddress',
  Timestamp = 'timestamp',
  UserToProduct = 'userToProduct',
  UserToProductId = 'userToProduct__id',
  UserToProductProduct = 'userToProduct__product',
  UserToProductTotalPoints = 'userToProduct__totalPoints',
  UserToProductUser = 'userToProduct__user'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  paymentToken?: Maybe<PaymentToken>;
  paymentTokens: Array<PaymentToken>;
  productCounter?: Maybe<ProductCounter>;
  productCounters: Array<ProductCounter>;
  productSale?: Maybe<ProductSale>;
  productSales: Array<ProductSale>;
  userToProduct?: Maybe<UserToProduct>;
  userToProducts: Array<UserToProduct>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryPaymentTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPaymentTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PaymentToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PaymentToken_Filter>;
};


export type QueryProductCounterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProductCountersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProductCounter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductCounter_Filter>;
};


export type QueryProductSaleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProductSalesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProductSale_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductSale_Filter>;
};


export type QueryUserToProductArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserToProductsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserToProduct_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserToProduct_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  paymentToken?: Maybe<PaymentToken>;
  paymentTokens: Array<PaymentToken>;
  productCounter?: Maybe<ProductCounter>;
  productCounters: Array<ProductCounter>;
  productSale?: Maybe<ProductSale>;
  productSales: Array<ProductSale>;
  userToProduct?: Maybe<UserToProduct>;
  userToProducts: Array<UserToProduct>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionPaymentTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPaymentTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PaymentToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PaymentToken_Filter>;
};


export type SubscriptionProductCounterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProductCountersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProductCounter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductCounter_Filter>;
};


export type SubscriptionProductSaleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProductSalesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProductSale_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductSale_Filter>;
};


export type SubscriptionUserToProductArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserToProductsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserToProduct_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserToProduct_Filter>;
};

export type UserToProduct = {
  __typename?: 'UserToProduct';
  id: Scalars['Bytes'];
  product: Scalars['Bytes'];
  totalPoints: Scalars['BigInt'];
  user: Scalars['Bytes'];
};

export type UserToProduct_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UserToProduct_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<UserToProduct_Filter>>>;
  product?: InputMaybe<Scalars['Bytes']>;
  product_contains?: InputMaybe<Scalars['Bytes']>;
  product_gt?: InputMaybe<Scalars['Bytes']>;
  product_gte?: InputMaybe<Scalars['Bytes']>;
  product_in?: InputMaybe<Array<Scalars['Bytes']>>;
  product_lt?: InputMaybe<Scalars['Bytes']>;
  product_lte?: InputMaybe<Scalars['Bytes']>;
  product_not?: InputMaybe<Scalars['Bytes']>;
  product_not_contains?: InputMaybe<Scalars['Bytes']>;
  product_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  totalPoints?: InputMaybe<Scalars['BigInt']>;
  totalPoints_gt?: InputMaybe<Scalars['BigInt']>;
  totalPoints_gte?: InputMaybe<Scalars['BigInt']>;
  totalPoints_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPoints_lt?: InputMaybe<Scalars['BigInt']>;
  totalPoints_lte?: InputMaybe<Scalars['BigInt']>;
  totalPoints_not?: InputMaybe<Scalars['BigInt']>;
  totalPoints_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_gt?: InputMaybe<Scalars['Bytes']>;
  user_gte?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_lt?: InputMaybe<Scalars['Bytes']>;
  user_lte?: InputMaybe<Scalars['Bytes']>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum UserToProduct_OrderBy {
  Id = 'id',
  Product = 'product',
  TotalPoints = 'totalPoints',
  User = 'user'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetAccountPoolsQueryVariables = Exact<{
  user?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetAccountPoolsQuery = { __typename?: 'Query', userToProducts: Array<{ __typename?: 'UserToProduct', product: any, totalPoints: any }> };

export type GetPoolAccountQueryVariables = Exact<{
  product?: InputMaybe<Scalars['Bytes']>;
  user?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetPoolAccountQuery = { __typename?: 'Query', userToProducts: Array<{ __typename?: 'UserToProduct', address: any, points: any }> };

export type GetPoolAccountsQueryVariables = Exact<{
  product?: InputMaybe<Scalars['Bytes']>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetPoolAccountsQuery = { __typename?: 'Query', userToProducts: Array<{ __typename?: 'UserToProduct', address: any, points: any }> };

export type GetPoolAccountsWithoutOneUserQueryVariables = Exact<{
  product?: InputMaybe<Scalars['Bytes']>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  userNot?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetPoolAccountsWithoutOneUserQuery = { __typename?: 'Query', userToProducts: Array<{ __typename?: 'UserToProduct', address: any, points: any }> };

export type GetUsersInPoolCountQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetUsersInPoolCountQuery = { __typename?: 'Query', productCounter?: { __typename?: 'ProductCounter', count: any } | null };

export type GetProductQueryVariables = Exact<{
  productProxyAddress?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetProductQuery = { __typename?: 'Query', productSales: Array<{ __typename?: 'ProductSale', alias: any }> };

export type GetDeployedProductsQueryVariables = Exact<{
  id_contains?: InputMaybe<Scalars['Bytes']>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
}>;


export type GetDeployedProductsQuery = { __typename?: 'Query', productSales: Array<{ __typename?: 'ProductSale', id: any, timestamp: any, proxy: any, price: any, user: { __typename?: 'UserToProduct', address: any } }>, productCounter?: { __typename?: 'ProductCounter', count: any } | null };

export type GetPaymentTokensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentTokensQuery = { __typename?: 'Query', paymentTokens: Array<{ __typename?: 'PaymentToken', token: any }> };


export const GetAccountPools = gql`
    query getAccountPools($user: Bytes) {
  userToProducts(where: {user: $user}, orderBy: totalPoints, orderDirection: desc) {
    product
    totalPoints
  }
}
    `;
export const GetPoolAccount = gql`
    query getPoolAccount($product: Bytes, $user: Bytes) {
  userToProducts(where: {product: $product, user: $user}) {
    address: user
    points: totalPoints
  }
}
    `;
export const GetPoolAccounts = gql`
    query getPoolAccounts($product: Bytes, $first: Int, $skip: Int) {
  userToProducts(
    where: {product: $product}
    first: $first
    skip: $skip
    orderBy: totalPoints
    orderDirection: desc
  ) {
    address: user
    points: totalPoints
  }
}
    `;
export const GetPoolAccountsWithoutOneUser = gql`
    query getPoolAccountsWithoutOneUser($product: Bytes, $first: Int, $skip: Int, $userNot: Bytes) {
  userToProducts(
    where: {product: $product, user_not: $userNot}
    first: $first
    skip: $skip
    orderBy: totalPoints
    orderDirection: desc
  ) {
    address: user
    points: totalPoints
  }
}
    `;
export const GetUsersInPoolCount = gql`
    query getUsersInPoolCount($id: ID!) {
  productCounter(id: $id) {
    count: usersBought
  }
}
    `;
export const GetProduct = gql`
    query getProduct($productProxyAddress: Bytes) {
  productSales(where: {productProxyAddress: $productProxyAddress}) {
    alias: id
  }
}
    `;
export const GetDeployedProducts = gql`
    query getDeployedProducts($id_contains: Bytes, $first: Int, $skip: Int, $id: ID!) {
  productSales(
    where: {id_contains: $id_contains}
    first: $first
    skip: $skip
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    user: userToProduct {
      address: user
    }
    proxy: productProxyAddress
    timestamp
    price: initialPrice
  }
  productCounter(id: $id) {
    count: productSalesCount
  }
}
    `;
export const GetPaymentTokens = gql`
    query getPaymentTokens {
  paymentTokens {
    token: id
  }
}
    `;