import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import { PlanetsModule } from "src/planets/planets.module";

describe('PlanetController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PlanetsModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/planets')
            .expect(200)
    });

    afterAll(async () => {
        await app.close();
    })
})