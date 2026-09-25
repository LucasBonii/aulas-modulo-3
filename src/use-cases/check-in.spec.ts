import { beforeEach, describe, expect, it, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/client";
import { MaxNumberOfCheckinsError } from "./errors/max-number-of-checkins-errors";
import { MaxDistanceError } from "./errors/max-distance-errors";

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)
        await gymsRepository.create({
            id: 'gym-01',
            title: 'Academia',
            description: '0',
            phone: '',
            latitude: -25.8613679,
            longitude: -52.5372063,
        })
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {

        const {checkIn} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -25.8613679,
            userLongitude: -52.5372063,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })


    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2026, 8, 21, 8, 0, 0))

        const {checkIn} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -25.8613679,
            userLongitude: -52.5372063,
        })
        

        await expect(sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -25.8613679,
            userLongitude: -52.5372063,
        })).rejects.toBeInstanceOf(MaxNumberOfCheckinsError)
    })

    it('should be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2026, 8, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -25.8613679,
            userLongitude: -52.5372063,
        })
        
        vi.setSystemTime(new Date(2026, 8, 22, 8, 0, 0))

        const {checkIn} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -25.8613679,
            userLongitude: -52.5372063,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in distant gym', async () => {

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Academia',
            description: '0',
            phone: '',
            latitude: new Decimal(-25.5578071),
            longitude:  new Decimal(-52.9253192),
        })

       await expect(() =>  sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -25.8613679,
            userLongitude: -52.5372063,
        })).rejects.toBeInstanceOf(MaxDistanceError)

    })
})

