import { Test, TestingModule } from "@nestjs/testing";
import { PlanetsController } from "./planets.controller"
import { Planet } from "./planets.entity";

describe('Planets controller', () => {
    let planetsController: PlanetsController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [PlanetsController],
        }).compile();

        planetsController = app.get<PlanetsController>(PlanetsController);
    });

    describe('findOne', () => {
        it('sould return planet object with ID 1', async () => {
            const result = await planetsController.findOne(1);
            expect(result.id).toBe(1);
        })
    })
})