import { env } from "node:process"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client.js"

const connectionString = process.env.DATABASE_URL!

const url = new URL(connectionString)

const adapter = new PrismaPg(
    {
        connectionString,
    },
    {
        schema: url.searchParams.get("schema") ?? "public",
    },
)

export const prisma = new PrismaClient({
    adapter,
    log: env.NODE_ENV === "dev" ? ["query"] : [],
})