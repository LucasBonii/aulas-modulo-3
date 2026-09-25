import { PrismaGymRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { FetchGymsNearByUseCase } from "../fetch-nearby-gyms"

export function makeFetchGymsNearByUseCase(){
    const gymsRepository = new PrismaGymRepository()
    const useCase = new FetchGymsNearByUseCase(gymsRepository)

    return useCase
}