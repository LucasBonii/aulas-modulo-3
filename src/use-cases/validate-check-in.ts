import { CheckIn } from "@/generated/prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gym-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-errors";
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between-coordinates";
import { MaxNumberOfCheckinsError } from "./errors/max-number-of-checkins-errors";
import { MaxDistanceError } from "./errors/max-distance-errors";
import id from "zod/v4/locales/id.js";
import { check } from "zod";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-errors";

interface ValidateCheckInUseCaseRequest{
    checkInId: string
}

interface ValidateCheckInUseCaseResponse{
    checkIn: CheckIn
}

export class ValidateCheckInUseCase{
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({checkInId}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
        
        const checkIn = await this.checkInsRepository.findById(checkInId)

        if(!checkIn){
            throw new ResourceNotFoundError()
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes'
        )

        if (distanceInMinutesFromCheckInCreation > 20){
            throw new LateCheckInValidationError()
        }

        checkIn.validated_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return {checkIn}
    }
}