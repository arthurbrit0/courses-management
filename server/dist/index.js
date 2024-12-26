"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dynamoose = __importStar(require("dynamoose"));
/* Importação de rotas */
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
/* Configurações */
dotenv_1.default.config();
const isProduction = process.env.NODE_ENV === "production"; // Verificando se estamos em ambiente de produção
if (!isProduction) {
    dynamoose.aws.ddb.local(); // Configurando o DynamoDB local se não estivermos na AWS (produção)                                  
}
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Configurando o express para usar JSON nas requisições
app.use((0, helmet_1.default)()); // Configurando o Helmet para segurança (adiicona headers HTTP de segurança nas requisições)
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common")); // Configurando o Morgan para logs de requisições HTTP
app.use(body_parser_1.default.json()); // Configurando o Body Parser para requisições com JSON
app.use(body_parser_1.default.urlencoded({ extended: false })); // Configurando o Body Parser para requisições com URL Encoded
app.use((0, cors_1.default)()); // Configurando o CORS para permitir requisições de outros domínios
/* Rotas */
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/courses", courseRoutes_1.default); // Configurando a rota de cursos
/* Server */
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
if (!isProduction) {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}
