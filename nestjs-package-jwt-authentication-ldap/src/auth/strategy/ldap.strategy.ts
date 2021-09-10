import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import * as Strategy from 'passport-ldapauth';
import { envConstants } from '../../common/constants';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(private readonly configService: ConfigService) {
    super({
      // allows us to pass back the entire request to the callback
      passReqToCallback: true,
      server: {
        // ldapOptions
        url: `ldap://${configService.get(envConstants.LDAP_URL)}`,
        bindDN: configService.get(envConstants.LDAP_BIND_DN),
        bindCredentials: configService.get(envConstants.LDAP_BIND_CREDENTIALS),
        searchBase: configService.get(envConstants.LDAP_SEARCH_BASE),
        // don't change searchFilter and searchAttributes variables name, this is a options object to be used in ldap server
        searchFilter: configService.get(envConstants.LDAP_SEARCH_USER_FILTER_STRATEGY),
        searchAttributes: configService.get(envConstants.LDAP_SEARCH_USER_ATTRIBUTES).toString().split(','),
      },
    }, async (req: Request, user: any, done) => {
      // add user to request
      req.user = user;
      return done(null, user);
    });
  }
}