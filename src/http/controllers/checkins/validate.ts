
import z from "zod"
import { FastifyRequest, FastifyReply } from "fastify"
import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case"

export async function validate(request: FastifyRequest, reply: FastifyReply){
    const validateCheckParamsSchema = z.object({
        checkInId: z.uuid()
    })

    const {checkInId} =  validateCheckParamsSchema.parse(request.params)


    const validateCheckInUseCase =  makeValidateCheckInUseCase()

    await validateCheckInUseCase.execute({
        checkInId
    })
    

    return reply.status(204).send()
}