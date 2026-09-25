import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchGymsNearByUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository
let sut: FetchGymsNearByUseCase

describe('Search Gyms Use Case', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchGymsNearByUseCase(gymsRepository)

    })

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -25.5613679,
            longitude: -52.3372063,
        })

        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -25.8613680,
            longitude: -52.5372070,
        })

        const {gyms} = await sut.execute({
            userLatitude: -25.8613680,
            userLongitude: -52.5372070,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Near Gym'}),
        ])
    })
})

