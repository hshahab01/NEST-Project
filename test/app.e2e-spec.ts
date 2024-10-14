import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum';
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateContactDto, EditContactDto } from "src/contact/dto";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333')
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'abc@xyz.com',
      password: '123'
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .expectStatus(400);
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .inspect()
          .stores('token', '');
      });
    });
  });
  describe('Users', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: '$S{token}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should get current user', () => {
        const dto: EditUserDto = {
          email: 'abc@rip.com',
          name: 'no'
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: '$S{token}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.name)
      });
    });
  });


  describe('Contact', () => {
    describe('Get Empty Contacts', () => {
      it('should get no contacts', () => {
        return pactum
          .spec()
          .get('/contacts')
          .withHeaders({
            Authorization: '$S{token}',
          })
          .expectStatus(200)
          .expectBody([])
      });
    });
    describe('Create Contact', () => {
      const dto: CreateContactDto = {
        name: 'john',
        number: 123
      };
      it('should create contact', () => {
        return pactum
          .spec()
          .post('/contacts')
          .withHeaders({
            Authorization: '$S{token}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('contactId', 'id');
      });
    });
    describe('Get Contact', () => {
      it('should get 1 contact', () => {
        return pactum
          .spec()
          .get('/contacts')
          .withHeaders({
            Authorization: '$S{token}',
          })
          .expectStatus(200)
          .inspect()
      });
    });
    describe('Get Contact By Id', () => {
      it('should get 1 contact', () => {
        return pactum
          .spec()
          .get('/contacts/{id}')
          .withHeaders({
            Authorization: '$S{token}',
          })
          .withPathParams('id', '$S{contactId}')
          .expectStatus(200)
          .inspect()
      });
    });
    describe('Edit Contact', () => {
      it('should edit contact', () => {
        const dto: EditContactDto = {
          name: 'doe'
        };
        return pactum
          .spec()
          .patch('/contacts/{id}')
          .withHeaders({
            Authorization: '$S{token}',
          })
          .withBody(dto)
          .withPathParams('id', '$S{contactId}')
          .expectStatus(200)
          .inspect()
      });
    });
    describe('Delete Contact', () => {
      it('should delete contact', () => {
        return pactum
          .spec()
          .delete('/contacts/{id}')
          .withHeaders({
            Authorization: '$S{token}',
          })
          .withPathParams('id', '$S{contactId}')
          .expectStatus(200)
      });
    });

    it('should get no contacts', () => {
      return pactum
        .spec()
        .get('/contacts')
        .withHeaders({
          Authorization: '$S{token}',
        })
        .expectStatus(200)
        .expectJsonLength(0);
    });

  });
  describe('Delete user', () => {
    it('should delete user', () => {
      return pactum
        .spec()
        .delete('/users')
        .withHeaders({
          Authorization: '$S{token}',
        })
        .expectStatus(200)
        .inspect()
    });
  });
});




