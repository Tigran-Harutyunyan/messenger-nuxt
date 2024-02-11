
import prisma from "../../libs/prismadb";
import { hashSync } from "bcrypt-ts";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const {
        email,
        name,
        password,
    } = body;

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (user) {
        throw createError({
            statusCode: 500,
            statusMessage: "User with your email already exists"
        })
    }

    const hashedPassword = await hashSync(password, 12);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            }
        })
        return user;
    } catch (e) {
        return e
    }
});