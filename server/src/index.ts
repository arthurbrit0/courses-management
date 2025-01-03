import express from "express";
import dotenv from "dotenv";
import  bodyParser from "body-parser"
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dynamoose from "dynamoose";
import { clerkMiddleware, createClerkClient, requireAuth } from "@clerk/express";
import serverless from "serverless-http";
import seed from "./seed/seedDynamodb";

/* Importação de rotas */

import userClerkRoutes from "./routes/userClerkRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import courseRoutes from "./routes/courseRoutes";
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes";

/* Configurações */

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";              // Verificando se estamos em ambiente de produção
if (!isProduction) {
    dynamoose.aws.ddb.local();                                           // Configurando o DynamoDB local se não estivermos na AWS (produção)                                  
}

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
})

const app = express();

app.use(express.json());                                                 // Configurando o express para usar JSON nas requisições
app.use(helmet());                                                       // Configurando o Helmet para segurança (adiicona headers HTTP de segurança nas requisições)
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));                                               // Configurando o Morgan para logs de requisições HTTP
app.use(bodyParser.json());                                              // Configurando o Body Parser para requisições com JSON
app.use(bodyParser.urlencoded({ extended: false }));                     // Configurando o Body Parser para requisições com URL Encoded
app.use(cors());                                                         // Configurando o CORS para permitir requisições de outros domínios
app.use(clerkMiddleware());


/* Rotas */

app.get("/", (req, res) => {
    res.send("Hello, World!")
});

app.use("/courses", courseRoutes);                                       // Configurando a rota de cursos
app.use("/users/clerk", requireAuth(), userClerkRoutes);
app.use("/transactions", requireAuth(), transactionRoutes);
app.use("/users/course-progress", requireAuth(), userCourseProgressRoutes);

/* Server */

const port = process.env.PORT ?? 3000;
if (!isProduction) {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    })
}

/* AWS */

const serverlessApp = serverless(app);
export const handler = async (event: any, context: any) => {
    if (event.action === "seed") {
        await seed();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Seed realizado com sucesso!" }) // arrumar segurança
        }
    } else {
        return serverlessApp(event, context);
    }
}