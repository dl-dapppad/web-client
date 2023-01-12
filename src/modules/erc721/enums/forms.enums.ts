export enum READ_FORMS {
  null = 'null',
  balance = 'balance',
  owner = 'owner',
  tokenByIndex = 'token-by-index',
  tokenOfOwnerByIndex = 'token-of-owner-by-index',
  tokenUri = 'token-uri',
}

export enum WRITE_FORMS {
  null = 'null',
  approve = 'approve',
  approveAll = 'approve-all',
  transferOwnership = 'transfer-ownership',
  burn = 'burn',
  mint = 'mint',
  safeTransfer = 'safe-transfer',
  setBaseUri = 'safe-base-uri',
  upgradeTo = 'upgrade-to',
}
