import fastify from "fastify"
import fastifyJwt from "@fastify/jwt"
import { ZodError, z } from "zod"
import { env } from "./env"
import fastifyCookie from "@fastify/cookie"
import { usersRoutes } from "./http/controllers/users/routes"
import { gymRoutes } from "./http/controllers/gyms/routes"
import { checkInRoutes } from "./http/controllers/checkins/routes"

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie:{
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    }
})


app.register(fastifyCookie)
app.register(usersRoutes)
app.register(gymRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, _, reply) => {
    if(error instanceof ZodError){
        return reply.status(400).send({message: 'Validation error.', issues: z.treeifyError(error)})
    }

    if (env.NODE_ENV != 'production'){
        console.error(error)
    } else{
        //TODO
    }

    return reply.status(500).send({message: 'Internal server error'})
})