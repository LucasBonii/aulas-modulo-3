import { Gym } from "@/generated/prisma/client";
import { GymCreateInput } from "@/generated/prisma/models";
import { FindManyNearbyParams, GymsRepository } from "../gym-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymRepository implements GymsRepository{
    async findById(id: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id
            }
        })
        return gym
    }
    
    async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
        const url = new URL(process.env.DATABASE_URL!)
        const schema = url.searchParams.get('schema') ?? 'public'

        const gyms = await prisma.$queryRawUnsafe<Gym[]>(`
            SELECT *
            FROM "${schema}"."gyms"
            WHERE (
                6371 * acos(
                    cos(radians(${latitude}))
                    * cos(radians(latitude::double precision))
                    * cos(radians(longitude::double precision) - radians(${longitude}))
                    + sin(radians(${latitude}))
                    * sin(radians(latitude::double precision))
                )
            ) <= 5
        `)

        return gyms
    }

    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            take: 20,
            skip: (page-1) *20
        })

        return gyms
    }

    async create(data: GymCreateInput) {
        const gym = await prisma.gym.create({
            data
        })

        return gym
    }
}