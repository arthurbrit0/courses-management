import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isStudentRoute = createRouteMatcher(["/user/(.*)"])               // Verificamos se a rota atual é de estudante
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"])            // Verificamos se a rota atual é de professor

export default clerkMiddleware(async (auth, req) => {
    const { sessionClaims } = await auth();                             // Desestruturamos o campo sessionClaims do objeto retornado por auth()
    const userRole = 
        (sessionClaims?.metadata as {                                   // Pegamos os dados do usuário autenticado, especificamente o userType
             userType: "student" | "teacher"                            // Enum no tipo userType do objeto metadata da sessionClaims
        })?.userType || "student";                                      // Se houver um userType, pegamos ele, senão, definimos como estudante
    
    if (isStudentRoute(req)) {                                          // Usamos a função que criamos para verificar se a rota da requisição e'de estudante
        if (userRole !== "student") {                                   // Se a rota da requisição for de estudante mas o usuário não for um estudante,
            const url = new URL("/teacher/courses", req.url);           // Criamos uma nova URL, redirecionando o usuário para a rota de professor
            return NextResponse.redirect(url)                           // Retornamos um redirecionamento para a nova URL
        }
    }
    if (isTeacherRoute(req)) {                                          // Mesma coisa para a rota de professor, redirecionando para rota de aluno
        if (userRole !== "teacher") {
            const url = new URL("/user/courses", req.url);
            return NextResponse.redirect(url)
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ]
}