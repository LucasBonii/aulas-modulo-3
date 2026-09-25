import { CheckIn, Prisma } from "@/generated/prisma/client";

export interface CheckInsRepository{
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    findManyByUserId(user_id: string, page: number): Promise<CheckIn[]>
    findByUserIdOnDate(user_id: string, date: Date): Promise<CheckIn | null>
    findById(id: string): Promise<CheckIn | null>
    countByUserId(user_id: string): Promise<number>
    save(checkIn: CheckIn): Promise<CheckIn>
}