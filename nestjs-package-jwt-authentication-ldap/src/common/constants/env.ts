export const envConstants = {
  // jwt
  ACCESS_TOKEN_JWT_SECRET: 'ACCESS_TOKEN_JWT_SECRET',
  ACCESS_TOKEN_EXPIRES_IN: 'ACCESS_TOKEN_EXPIRES_IN',
  REFRESH_TOKEN_JWT_SECRET: 'REFRESH_TOKEN_JWT_SECRET',
  REFRESH_TOKEN_EXPIRES_IN: 'REFRESH_TOKEN_EXPIRES_IN',
  REFRESH_TOKEN_SKIP_INCREMENT_VERSION: 'REFRESH_TOKEN_SKIP_INCREMENT_VERSION',
  // ldap
  LDAP_URL: 'LDAP_URL',
  LDAP_BIND_DN: 'LDAP_BIND_DN',
  LDAP_BIND_CREDENTIALS: 'LDAP_BIND_CREDENTIALS',
  LDAP_SEARCH_BASE: 'LDAP_SEARCH_BASE',
  LDAP_SEARCH_USER_FILTER_STRATEGY: 'LDAP_SEARCH_USER_FILTER_STRATEGY',
  LDAP_SEARCH_USER_FILTER: 'LDAP_SEARCH_USER_FILTER',
  LDAP_SEARCH_USER_ATTRIBUTES: 'LDAP_SEARCH_USER_ATTRIBUTES',
  LDAP_SEARCH_GROUP_FILTER: 'LDAP_SEARCH_GROUP_FILTER',
  LDAP_SEARCH_GROUP_ATTRIBUTES: 'LDAP_SEARCH_GROUP_ATTRIBUTES',
  LDAP_SEARCH_GROUP_PREFIX: 'LDAP_SEARCH_GROUP_PREFIX',
  LDAP_SEARCH_GROUP_EXCLUDE_GROUPS: 'LDAP_SEARCH_GROUP_EXCLUDE_GROUPS',
  // not used
  // LDAP_ADD_DEFAULT_NAME_POSTFIX: 'LDAP_ADD_DEFAULT_NAME_POSTFIX',
  LDAP_BASE_DN: 'LDAP_BASE_DN',
  LDAP_NEW_USER_DN_POSTFIX: 'LDAP_NEW_USER_DN_POSTFIX',
  // new used in cache filter
  LDAP_SEARCH_CACHE_FILTER: 'LDAP_SEARCH_CACHE_FILTER',
  // app ldap admins
  LDAP_ROOT_USER: 'LDAP_ROOT_USER'
}
