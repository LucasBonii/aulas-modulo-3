import { Gym } from "@/generated/prisma/client"
import { GymsRepository } from "@/repositories/gym-repository"

interface FetchGymsNearByUseCaseRequest {
    userLatitude: number
    userLongitude: number
}

interface FetchGymsNearByUseCaseResponse{
    gyms: Gym[]
}

export class FetchGymsNearByUseCase{
    
    constructor( private gymsRepository: GymsRepository,){
        
    }

    async execute({userLatitude, userLongitude}: FetchGymsNearByUseCaseRequest): Promise<FetchGymsNearByUseCaseResponse>{

        const gyms = await this.gymsRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude
        })
        return {gyms}    
    }
}


