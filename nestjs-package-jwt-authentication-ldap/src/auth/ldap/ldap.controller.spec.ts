import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { mockedConfigService } from '../utils/mocks/config.service';
import { AddOrDeleteUserToGroupDto, CacheResponseDto, ChangeDefaultGroupDto, ChangeUserPasswordDto, ChangeUserProfileDto, ChangeUserRecordDto, DeleteUserRecordDto, SearchUserPaginatorResponseDto, SearchUserRecordResponseDto, SearchUserRecordsDto } from './dto';
import { CreateUserRecordDto } from './dto/create-user-record.dto';
import { ChangeUserRecordOperation, Objectclass, UpdateCacheOperation } from './enums';
import { LdapController } from './ldap.controller';
import { LdapService } from './ldap.service';

describe('LdapController', () => {
  let controller: LdapController;
  let service: LdapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LdapController],
      providers: [
        LdapService,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
      ]
    }).compile();

    controller = module.get<LdapController>(LdapController);
    service = module.get<LdapService>(LdapService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('POST /user', () => {
    it('should test createUserRecord - Successfully', async () => {
      const res = mockResponse();
      // const res = mockResponse({status: 403});
      const input: CreateUserRecordDto = {
        cn: 'user_test',
        unicodePwd: '1234',
        givenName: 'Vitor',
        sn: 'Joao',
        defaultGroup: 'c3Administrator',
        displayName: 'Vitor Joao',
        objectClass: Objectclass.USER,
        mail: 'vitor.joao@critical-links.com',
        dateOfBirth: 19711219,
        gender: 'M',
        telephoneNumber: '+351910000000',
        studentID: '34273462836a'
      };
      jest
        .spyOn(service, 'createUserRecord')
        .mockImplementationOnce(async () => Promise.resolve());
      await controller.createUserRecord(res, input);
      expect(service.createUserRecord).toHaveBeenCalledWith(input);
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })

    it('should test createUserRecord - Error', async () => {
      const res = mockResponse();
      const input: CreateUserRecordDto = undefined;
      jest
        .spyOn(service, 'createUserRecord')
        .mockRejectedValue(() => { throw new Error() });

      await controller.createUserRecord(res, input)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.createUserRecord).toHaveBeenCalledWith(input);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })

  })

  describe(' /group/:operation', () => {
    it('should test addMemberToGroup - Successfully', async () => {
      const res = mockResponse();
      const operation: ChangeUserRecordOperation = ChangeUserRecordOperation.ADD;
      const addUserToGroupDto: AddOrDeleteUserToGroupDto = { cn: 'c3Test', group: 'c3student', defaultGroup: 'c3student' };
      jest
        .spyOn(service, 'addOrDeleteUserToGroup')
        .mockImplementationOnce(async () => Promise.resolve());
      await controller.addMemberToGroup(res, operation, addUserToGroupDto)
        .then(() => {
          expect(service.addOrDeleteUserToGroup).toHaveBeenCalledWith(operation, addUserToGroupDto);
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);

    })

    it('should test addMemberToGroup - Error', async () => {
      const res = mockResponse();
      const operation: ChangeUserRecordOperation = undefined;
      const addUserToGroupDto: AddOrDeleteUserToGroupDto = { cn: 'c3Test', group: 'c3student', defaultGroup: 'c3student' };
      jest
        .spyOn(service, 'addOrDeleteUserToGroup')
        .mockRejectedValue(() => { throw new Error('Error Message') });

      await controller.addMemberToGroup(res, operation, addUserToGroupDto)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.createUserRecord).toHaveBeenCalledWith(operation, addUserToGroupDto);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })
  })

  describe('PUT /defaultGroup', () => {
    it('should test updateDefaultGroup - Successfully', async () => {
      const res = mockResponse();
      const changeDefaultGroupDto: ChangeDefaultGroupDto = { cn: 'user1', defaultGroup: 'c3student' };
      jest
        .spyOn(service, 'updateDefaultGroup')
        .mockImplementationOnce(async () => Promise.resolve());
      await controller.updateDefaultGroup(res, changeDefaultGroupDto)
        .then(() => {
          expect(service.updateDefaultGroup).toHaveBeenCalledWith(changeDefaultGroupDto);
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);

    })
  })

  describe(' /user/:cn', () => {
    it('should test getUserRecord - Successfully', async () => {
      const res = mockResponse();
      const cn = 'c3';
      const spyUserRecord: SearchUserRecordResponseDto = {
        user: {
          dn: 'CN=c3,OU=C3Administrator,OU=People,DC=c3edu,DC=online',
          memberOf: [
            'CN=C3Administrator,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Teacher,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Parent,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Student,OU=Groups,DC=c3edu,DC=online',
            'CN=Domain Admins,CN=Users,DC=c3edu,DC=online',
          ],
          controls: [
          ],
          objectCategory: 'CN=Person,CN=Schema,CN=Configuration,DC=c3edu,DC=online',
          distinguishedName: 'CN=c3,OU=C3Administrator,OU=People,DC=c3edu,DC=online',
          userAccountControl: '66056',
          lastLogonTimestamp: '132576251909012870',
          cn: 'c3',
          givenName: 'C3',
          sn: undefined,
          email: undefined,
          displayName: 'C3_Test',
          gender: undefined,
          mail: undefined,
          c3UserRole: undefined,
          dateOfBirth: undefined,
          studentID: undefined,
          telephoneNumber: undefined,
        },
        status: 1
      };
      jest
        .spyOn(service, 'getUserRecord')
        .mockImplementationOnce(async () => spyUserRecord);
      await controller.getUserRecord(res, cn)
        .then(() => {
          expect(service.getUserRecord).toHaveBeenCalledWith(cn);
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })

    it('should test getUserRecord - Error', async () => {
      const res = mockResponse();
      const cn = undefined;
      jest
        .spyOn(service, 'getUserRecord')
        .mockRejectedValue(() => { throw new Error('Error Message') });

      await controller.getUserRecord(res, cn)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.getUserRecord).toHaveBeenCalledWith(cn);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })
  })

  describe(' /cache/init', () => {
    it('should test initUserRecordsCache - Successfully', async () => {
      const res = mockResponse();
      const input = {
        filter: '(objectCategory=CN=Person,CN=Schema,CN=Configuration,DC=c3edu,DC=online)'
      };
      const spyService: CacheResponseDto = {
        lastUpdate: 1,
        totalRecords: 2,
        elapsedTime: 3,
        memoryUsage: {},
        status: 1
      };
      jest
        .spyOn(service, 'initUserRecordsCache')
        .mockImplementationOnce(async () => spyService);
      await controller.initUserRecordsCache(res, input)
        .then(() => {
          expect(service.initUserRecordsCache).toHaveBeenCalledWith(input.filter);
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })

    it('should test initUserRecordsCache - Error', async () => {
      const res = mockResponse();
      const input = { filter: 'test' };
      jest
        .spyOn(service, 'initUserRecordsCache')
        .mockRejectedValue(() => { throw new Error('Error Message') });

      await controller.initUserRecordsCache(res, input)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.initUserRecordsCache).toHaveBeenCalledWith(input.filter);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })
  })

  describe('POST /cache/update', () => {
    it('should test updateUserRecordsCache - Successfully', async () => {
      const res = mockResponse();
      const payload: string[] = ['user1','user2','user3'];
      jest
        .spyOn(service, 'updateCachedUser')
        .mockImplementationOnce(async () => Promise.resolve());
      await controller.updateUserRecordsCache(res, payload)
        .then(() => {
          for (let i=0;i<payload.length;i++)
            expect(service.updateCachedUser).toHaveBeenCalledWith(UpdateCacheOperation.CREATE,payload[i]);
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })
  })

  describe(' /cache/search', () => {
    it('should test getUserRecords - Successfully', async () => {
      const res = mockResponse();
      const input: SearchUserRecordsDto = {
        page: 1,
        perPage: 25
      };
      const spyService: SearchUserPaginatorResponseDto = {
        page: 1,
        perPage: 10,
        prePage: null,
        nextPage: null,
        totalRecords: 4,
        totalPages: 1,
        data: [{
          dn: 'CN=c3,OU=C3Administrator,OU=People,DC=c3edu,DC=online',
          memberOf: [
            'CN=C3Administrator,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Teacher,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Parent,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Student,OU=Groups,DC=c3edu,DC=online',
            'CN=Domain Admins,CN=Users,DC=c3edu,DC=online'
          ],
          controls: [],
          objectCategory: 'CN=Person,CN=Schema,CN=Configuration,DC=c3edu,DC=online',
          distinguishedName: 'CN=c3,OU=C3Administrator,OU=People,DC=c3edu,DC=online',
          userAccountControl: '66056',
          lastLogonTimestamp: '132586652461591400',
          cn: 'c3',
          givenName: 'C3',
          sn: '',
          email: '',
          displayName: 'C3',
          gender: '',
          mail: '',
          c3UserRole: '',
          dateOfBirth: '',
          studentID: '22233333',
          telephoneNumber: '0000000'
        }]
      };
      jest
        .spyOn(service, 'getUserRecords')
        .mockReturnValue(Promise.resolve(spyService))
      await controller.getUserRecords(res, input)
        .then(() => {
          expect(service.getUserRecords).toHaveBeenCalledWith(input);
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })

    it('should test getUserRecords - Error', async () => {
      const res = mockResponse();
      const input: SearchUserRecordsDto = {
        page: 1,
        perPage: 25
      };
      jest
        .spyOn(service, 'getUserRecords')
        .mockRejectedValue(() => { throw new Error('Error Message') });

      await controller.getUserRecords(res, input)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.getUserRecords).toHaveBeenCalledWith(input);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })
  })

  describe('DELETE /user', () => {
    it('should test deleteUserRecord - Successfully', async () => {
      const res = mockResponse();
      const input: DeleteUserRecordDto = {
        cn: 'c3',
        defaultGroup: 'c3student'
      };
      jest
        .spyOn(service, 'deleteUserRecord')
        .mockImplementationOnce(() => { return Promise.resolve() });
      await controller.deleteUserRecord(res, input)
        .then(() => {
          expect(service.deleteUserRecord).toHaveBeenCalledWith(input);
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })

    it('should test deleteUserRecord - Error', async () => {
      const res = mockResponse();
      const input: DeleteUserRecordDto = {
        cn: 'c3',
        defaultGroup: 'c3student'
      };
      jest
        .spyOn(service, 'deleteUserRecord')
        .mockRejectedValue(() => { throw new Error('Error Message') });

      await controller.deleteUserRecord(res, input)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.deleteUserRecord).toHaveBeenCalledWith(input);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })
  })

  describe('PUT /user', () => {
    it('should test changeUserRecord - Successfully', async () => {
      const res = mockResponse();
      const input: ChangeUserRecordDto = {
        cn: 'c3',
        defaultGroup: 'c3student',
        changes: [
          {
            operation: 'replace',
            modification: {
              displayName: 'Name Changed '
            }
          }
        ]
      };
      jest
        .spyOn(service, 'changeUserRecord')
        .mockImplementationOnce(() => { return Promise.resolve() });
      await controller.changeUserRecord(res, input)
        .then(() => {
          expect(service.changeUserRecord).toHaveBeenCalledWith(input);
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })

    it('should test changeUserRecord - Error', async () => {
      const res = mockResponse();
      const input: ChangeUserRecordDto = {
        cn: 'c3',
        defaultGroup: 'c3student',
        changes: [
          {
            operation: 'replace',
            modification: {
              displayName: 'Name Changed '
            }
          }
        ]
      };
      jest
        .spyOn(service, 'changeUserRecord')
        .mockRejectedValue(() => { throw new Error('Error Message') });

      await controller.changeUserRecord(res, input)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.changeUserRecord).toHaveBeenCalledWith(input);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })
  })

  describe('GET /profile', () => {
    it('should test getUserProfileRecord - Successfully', async () => {
      const req = mockRequest({ user: { cn: 'c3' } });
      const res = mockResponse();
      const spyUserRecord: SearchUserRecordResponseDto = {
        user: {
          dn: 'CN=c3,OU=C3Administrator,OU=People,DC=c3edu,DC=online',
          memberOf: [
            'CN=C3Administrator,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Teacher,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Parent,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Student,OU=Groups,DC=c3edu,DC=online',
            'CN=Domain Admins,CN=Users,DC=c3edu,DC=online',
          ],
          controls: [
          ],
          objectCategory: 'CN=Person,CN=Schema,CN=Configuration,DC=c3edu,DC=online',
          distinguishedName: 'CN=c3,OU=C3Administrator,OU=People,DC=c3edu,DC=online',
          userAccountControl: '66056',
          lastLogonTimestamp: '132576251909012870',
          cn: 'c3',
          givenName: 'C3',
          sn: undefined,
          email: undefined,
          displayName: 'C3_Test',
          gender: undefined,
          mail: undefined,
          c3UserRole: undefined,
          dateOfBirth: undefined,
          studentID: undefined,
          telephoneNumber: undefined,
        },
        status: 1
      };
      jest
        .spyOn(service, 'getUserRecord')
        .mockImplementationOnce(async () => spyUserRecord);
      await controller.getUserProfileRecord(req, res)
        .then(() => {
          expect(service.getUserRecord).toHaveBeenCalledWith('c3');
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })

    it('should test getUserProfileRecord - Error', async () => {
      const req = mockRequest({ user: { cn: 'c3' } });
      const res = mockResponse();
      jest
        .spyOn(service, 'getUserRecord')
        .mockRejectedValue(() => { throw new Error('Error Message') });
      await controller.getUserProfileRecord(req, res)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.getUserRecord).toHaveBeenCalledWith(res);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })

    it('should test getUserProfileRecord - cn undefined', async () => {
      const req = mockRequest();
      const res = mockResponse();
      jest
        .spyOn(service, 'getUserRecord');
      await expect(controller.getUserProfileRecord(req, res)).rejects.toThrowError('invalid authenticated user')
    })

  })

  describe('PUT /profile', () => {
    it('should test changeUserProfileRecord - Successfully', async () => {
      const req = mockRequest({ user: { cn: 'c3' } });
      const res = mockResponse();
      const input: ChangeUserProfileDto = {
        defaultGroup: 'c3student',
        changes: [
          {
            operation: 'replace',
            modification: {
              displayName: 'Name Changed '
            }
          }
        ]
      };
      const spyUserRecord: SearchUserRecordResponseDto = {
        user: {
          dn: 'CN=c3,OU=C3Administrator,OU=People,DC=c3edu,DC=online',
          memberOf: [
            'CN=C3Administrator,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Teacher,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Parent,OU=Groups,DC=c3edu,DC=online',
            'CN=C3Student,OU=Groups,DC=c3edu,DC=online',
            'CN=Domain Admins,CN=Users,DC=c3edu,DC=online',
          ],
          controls: [
          ],
          objectCategory: 'CN=Person,CN=Schema,CN=Configuration,DC=c3edu,DC=online',
          distinguishedName: 'CN=c3,OU=C3Administrator,OU=People,DC=c3edu,DC=online',
          userAccountControl: '66056',
          lastLogonTimestamp: '132576251909012870',
          cn: 'c3',
          givenName: 'C3',
          sn: undefined,
          email: undefined,
          displayName: 'C3_Test',
          gender: undefined,
          mail: undefined,
          c3UserRole: undefined,
          dateOfBirth: undefined,
          studentID: undefined,
          telephoneNumber: undefined,
        },
        status: 1
      };
      jest
        .spyOn(service, 'changeUserRecord')
        .mockImplementationOnce(async () => Promise.resolve());
      await controller.changeUserProfileRecord(req, res, input)
        .then(() => {
          expect(service.changeUserRecord).toHaveBeenCalledWith({ ...input, cn: 'c3' });
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })

    it('should test changeUserProfileRecord - Error', async () => {
      const req = mockRequest({ user: { cn: 'c3' } });
      const res = mockResponse();
      const input: ChangeUserProfileDto = {
        defaultGroup: 'c3student',
        changes: [
          {
            operation: 'replace',
            modification: {
              displayName: 'Name Changed '
            }
          }
        ]
      };
      jest
        .spyOn(service, 'changeUserRecord')
        .mockRejectedValue(() => { throw new Error('Error Message') });
      await controller.changeUserProfileRecord(req, res, input)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.changeUserRecord).toHaveBeenCalledWith(res);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })

    it('should test changeUserProfileRecord - cn undefined', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const input: ChangeUserProfileDto = {
        defaultGroup: 'c3student',
        changes: [
          {
            operation: 'replace',
            modification: {
              displayName: 'Name Changed '
            }
          }
        ]
      };
      jest
        .spyOn(service, 'changeUserRecord');
      await expect(controller.changeUserProfileRecord(req, res, input)).rejects.toThrowError('invalid authenticated user')
    })
  })

  describe('PUT /profile', () => {
    it('should test changeUserProfilePassword - Successfully', async () => {
      const req = mockRequest({ user: { cn: 'c3' } });
      const res = mockResponse();
      const input: ChangeUserPasswordDto = {
        defaultGroup: 'c3student',
        oldunicodePwd: 'testOld',
        newunicodePwd: 'testNew'
      };
      jest
        .spyOn(service, 'changeUserProfilePassword')
        .mockImplementationOnce(async () => Promise.resolve());
      await controller.changeUserProfilePassword(req, res, input)
        .then(() => {
          expect(service.changeUserProfilePassword).toHaveBeenCalledWith('c3', input);
        });
      expect(res.status).not.toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    })

    it('should test changeUserProfilePassword - Error', async () => {
      const req = mockRequest({ user: { cn: 'c3' } });
      const res = mockResponse();
      const input: ChangeUserPasswordDto = {
        defaultGroup: 'c3student',
        oldunicodePwd: 'testOld',
        newunicodePwd: 'testNew'
      };
      jest
        .spyOn(service, 'changeUserProfilePassword')
        .mockRejectedValue(() => { throw new Error('Error Message') });
      await controller.changeUserProfilePassword(req, res, input)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(service.changeUserProfilePassword).toHaveBeenCalledWith(req, input);
        })
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    })

    it('should test changeUserProfilePassword - cn undefined', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const input: ChangeUserPasswordDto = {
        defaultGroup: 'c3student',
        oldunicodePwd: 'testOld',
        newunicodePwd: 'testNew'
      };
      jest
        .spyOn(service, 'changeUserRecord');
      await expect(controller.changeUserProfilePassword(req, res, input)).rejects.toThrowError('invalid authenticated user')
    })
  })

});
