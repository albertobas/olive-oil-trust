export const pollInterval = 2500; // undefined

export const sortTokenTypeCardsRecords = { date: 'Date', tokenType: 'Token type Id' };

export const sortEscrowCardsRecords = { date: 'Date' };

export const sortCertificateCardsRecords = { title: 'Title', date: 'Date' };

export const TOKEN_TYPE_FIELDS = `id
                                  identifier
                                  ...metadataFields
                                  certificates {
                                    certificate {
                                      id
                                      contract {
                                        id
                                        owner {
                                          asMemberContract {
                                            id
                                            name
                                            role
                                          }
                                        }
                                      }
                                      identifier
                                      ...metadataFields
                                      certification {
                                        id
                                        emitter {
                                          id
                                        }
                                        timestamp
                                        transaction {
                                          id
                                          blockNumber
                                          timestamp
                                          events {
                                            id
                                            emitter {
                                              id
                                            }
                                            timestamp
                                          }
                                        }
                                      }
                                      uri
                                    }
                                  }
                                  contract {
                                    id
                                    owner {
                                      asMemberContract {
                                        id
                                        name
                                        role
                                      }
                                    }
                                  }
                                  creationDate
                                  instructions {
                                    id
                                    instructedTokenAmount
                                    instructedCertificate {
                                      id
                                      title
                                      tokenTypes {
                                        tokenType {
                                          id
                                          title
                                          contract {
                                            owner {
                                              asMemberContract {
                                                role
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                    instructedTokenType {
                                      id
                                      title
                                      contract {
                                        owner {
                                          asMemberContract {
                                            role
                                          }
                                        }
                                      }
                                    }
                                  }
                                  uri
                                  tokenTypeInstructionsSet {
                                    id
                                    emitter {
                                      id
                                    }
                                    timestamp
                                    transaction {
                                      id
                                      blockNumber
                                      events {
                                        id
                                      }
                                      timestamp
                                    }
                                  }`;

export const METADATA_FIELDS_FRAGMENT = `fragment metadataFields on IMetadata {
                                          bottleQuality
                                          bottleMaterial
                                          bottleSize
                                          description
                                          imageHeight
                                          imagePath
                                          imageWidth
                                          oliveQuality
                                          oliveOilAcidity
                                          oliveOilAroma
                                          oliveOilBitterness
                                          oliveOilColour
                                          oliveOilFruitness
                                          oliveOilIntensity
                                          oliveOilItching
                                          oliveOrigin
                                          title
                                        }`;

export const CERTIFICATES_FIELDS = `...metadataFields
                                    id
                                    identifier
                                    certification {
                                      id
                                      emitter {
                                        id
                                      }
                                      timestamp
                                      transaction {
                                        id
                                        blockNumber
                                        timestamp
                                        events {
                                          id
                                          emitter {
                                            id
                                          }
                                          timestamp
                                        }
                                      }
                                    }
                                    contract {
                                      id
                                      owner {
                                        asMemberContract {
                                          id
                                          name
                                          role
                                        }
                                      }
                                    }
                                    creationDate
                                    tokenTypes {
                                      tokenType {
                                        ...metadataFields
                                        id
                                        identifier
                                        contract {
                                          id
                                          owner {
                                            asMemberContract {
                                              id
                                              name
                                              role
                                            }
                                          }
                                        }
                                        instructions {
                                          id
                                          instructedTokenAmount
                                          instructedCertificate {
                                            id
                                            title
                                            tokenTypes {
                                              tokenType {
                                                id
                                                title
                                                contract {
                                                  owner {
                                                    asMemberContract {
                                                      role
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                          instructedTokenType {
                                            id
                                            title
                                            contract {
                                              owner {
                                                asMemberContract {
                                                  role
                                                }
                                              }
                                            }
                                          }
                                        }
                                        tokenTypeInstructionsSet {
                                          id
                                          emitter {
                                            id
                                          }
                                          timestamp
                                          transaction {
                                            id
                                            blockNumber
                                            events {
                                              id
                                            }
                                            timestamp
                                          }
                                        }
                                        uri
                                      }
                                    }
                                    uri`;

export const ESCROW_FIELDS = `id
                              buyer {
                                id
                                asMemberContract {
                                  id
                                  name
                                  role
                                }
                              }
                              buyerWallet
                              contract {
                                id
                                owner {
                                  asMemberContract {
                                    id
                                    name
                                    role
                                  }
                                }
                              }
                              escrowId
                              escrowBalance {
                                id
                                escrowAccount {
                                  id
                                }
                                escrowAmounts
                                escrowTokens {
                                  id
                                  contract {
                                    id
                                  }
                                  tokenType {
                                    id
                                    identifier
                                    ...metadataFields
                                    instructions {
                                      id
                                      instructedTokenAmount
                                      instructedCertificate {
                                        id
                                        title
                                        tokenTypes {
                                          tokenType {
                                            id
                                            title
                                            contract {
                                              owner {
                                                asMemberContract {
                                                  role
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                      instructedTokenType {
                                        id
                                        title
                                        contract {
                                          owner {
                                            asMemberContract {
                                              role
                                            }
                                          }
                                        }
                                      }
                                    }
                                    tokenTypeInstructionsSet {
                                      id
                                      emitter {
                                        id
                                      }
                                      timestamp
                                      transaction {
                                        id
                                        blockNumber
                                        events {
                                          id
                                        }
                                        timestamp
                                      }
                                    }
                                    uri
                                  }
                                  identifier
                                  industrialUnitTokenInfo {
                                    id
                                    amounts
                                    industrialUnit {
                                      id
                                      identifier
                                    }
                                    commercialUnits {
                                      id
                                      identifier
                                    }
                                  }
                                  mintingDate
                                  totalSupply {
                                    id
                                    value
                                    valueExact
                                  }
                                }
                              }
                              etherBalance {
                                id
                                value
                                valueExact
                              }
                              identifier
                              price
                              seller {
                                id
                                asMemberContract {
                                  id
                                  name
                                  role
                                }
                              }
                              sellerWallet
                              state
                              tokenDeposits {
                                transaction {
                                  id
                                  blockNumber
                                  events {
                                    id
                                  }
                                  timestamp
                                }
                              }`;

export const TOKEN_FIELDS = `...tokenFields
                              escrows {
                                escrow {
                                  id
                                  buyer {
                                    id
                                  }
                                  buyerWallet
                                  contract {
                                    id
                                    owner {
                                      asMemberContract {
                                        id
                                        name
                                        role
                                      }
                                    }
                                  }
                                  escrowId
                                  escrowBalance {
                                    id
                                    escrowAccount {
                                      id
                                    }
                                    escrowAmounts
                                    escrowTokens {
                                      ...tokenFields
                                    }
                                  }
                                  etherBalance {
                                    id
                                    value
                                    valueExact
                                  }
                                  identifier
                                  price
                                  seller {
                                    id
                                  }
                                  sellerWallet
                                  state
                                  tokenDeposits {
                                    transaction {
                                      id
                                      blockNumber
                                      events {
                                        id
                                      }
                                      timestamp
                                    }
                                  }
                                }
                              }
                              ancestry {
                                amount
                                token {
                                  ...tokenFields
                                  ancestry {
                                    amount
                                    token {
                                      ...tokenFields
                                    }
                                  }
                                }
                              }`;

export const TOKEN_FIELDS_FRAGMENT = `fragment tokenFields on Token {
                                        ...basicTokenFields
                                        industrialUnitTokenInfo {
                                          id
                                          amounts
                                          industrialUnit {
                                            ...basicTokenFields
                                          }
                                          commercialUnits {
                                            ...basicTokenFields
                                          }
                                        }
                                      }

                                      fragment basicTokenFields on Token {
                                        id
                                        identifier
                                        contract {
                                          id
                                          owner {
                                            asMemberContract {
                                              id
                                              name
                                              role
                                            }
                                          }
                                        }
                                        tokenType {
                                          id
                                          identifier
                                          contract {
                                            id
                                            owner {
                                              asMemberContract {
                                                id
                                                name
                                                role
                                              }
                                            }
                                          }
                                          instructions {
                                            id
                                            instructedTokenAmount
                                            instructedCertificate {
                                              id
                                              title
                                              tokenTypes {
                                                tokenType {
                                                  id
                                                  title
                                                  contract {
                                                    owner {
                                                      asMemberContract {
                                                        role
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                            instructedTokenType {
                                              id
                                              title
                                              contract {
                                                owner {
                                                  asMemberContract {
                                                    role
                                                  }
                                                }
                                              }
                                            }
                                          }
                                          tokenTypeInstructionsSet {
                                            id
                                            emitter {
                                              id
                                            }
                                            timestamp
                                            transaction {
                                              id
                                              blockNumber
                                              events {
                                                id
                                              }
                                              timestamp
                                            }
                                          }
                                          uri
                                          ...metadataFields
                                        }
                                        mintingDate
                                        totalSupply {
                                          id
                                          value
                                          valueExact
                                        }
                                      }
                                      `;
