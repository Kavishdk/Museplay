import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";

const handler = NextAuth({
    adapter: PrismaAdapter(prismaClient),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""          
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM
        })
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks : {
        async signIn(params){
            if(!params.user.email){
                return false;
            }
            try{
                await prismaClient.user.create({
                    data : {
                        email: params.user.email,
                        provider: params.account?.provider || "Google"
                    }    
                })
            }catch(e){

            }  
            return true
        }
    } 
})


export { handler as GET, handler as POST }