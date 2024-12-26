"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seed;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dynamoose_1 = __importDefault(require("dynamoose"));
const pluralize_1 = __importDefault(require("pluralize"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const courseModel_1 = __importDefault(require("../models/courseModel"));
const userCourseProgressModel_1 = __importDefault(require("../models/userCourseProgressModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let client;
/* Configuração do DynamoDB */
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
    dynamoose_1.default.aws.ddb.local(); // Criando uma instância do DynamoDB local se não estivermos em produção
    client = new client_dynamodb_1.DynamoDBClient({
        endpoint: "http://localhost:8000", // Definindo o endpoint local
        region: "us-east-2",
        credentials: {
            accessKeyId: "dummyKey123",
            secretAccessKey: "dummyKey123",
        },
    });
}
else { // Se estivermos em produção, criamos um cliente do DynamoDB na AWS
    client = new client_dynamodb_1.DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-2",
    });
}
/* Avisos de Supress Tag do DynamoDB */
const originalWarn = console.warn.bind(console);
console.warn = (message, ...args) => {
    if (!message.includes("Tagging is not currently supported in DynamoDB Local")) {
        originalWarn(message, ...args);
    }
};
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        const models = [transactionModel_1.default, userCourseProgressModel_1.default, courseModel_1.default]; // Array com os modelos que queremos criar (Transacao, progresso no curso e curso)
        for (const model of models) { // Para cada modelo no array de modelos
            const tableName = model.name; // Pegamos o nome do modelo que importamos
            const table = new dynamoose_1.default.Table(tableName, [model], {
                create: true,
                update: true,
                waitForActive: true,
                throughput: { read: 5, write: 5 },
            });
            try {
                yield new Promise((resolve) => setTimeout(resolve, 2000));
                yield table.initialize();
                console.log(`Table created and initialized: ${tableName}`); // Fazemos um log da tabela criada
            }
            catch (error) {
                console.error(`Error creating table ${tableName}:`, // Capturamos qualquer erro que aconteça na criação da tabela
                error.message, error.stack);
            }
        }
    });
}
function seedData(tableName, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = JSON.parse(// Lemos o arquivo JSON com os dados que queremos adicionar
        fs_1.default.readFileSync(filePath, "utf8"));
        const formattedTableName = pluralize_1.default.singular(// Formatamos o nome da tabela para o singular
        tableName.charAt(0).toUpperCase() + tableName.slice(1));
        console.log(`Seeding data to table: ${formattedTableName}`); // Fazemos um log da tabela que estamos adicionando os dados
        for (const item of data) { // Para cada dado no arquivo JSON,
            try {
                yield dynamoose_1.default.model(formattedTableName).create(item); // Criamos um novo item no banco de dados na tabela que passamos como parametro
            }
            catch (err) {
                console.error(`Unable to add item to ${formattedTableName}. Error:`, // Se houver algum erro, fazemos um log do erro
                JSON.stringify(err, null, 2));
            }
        }
        console.log("\x1b[32m%s\x1b[0m", `Successfully seeded data to table: ${formattedTableName}`);
    });
}
function deleteTable(baseTableName) {
    return __awaiter(this, void 0, void 0, function* () {
        let deleteCommand = new client_dynamodb_1.DeleteTableCommand({ TableName: baseTableName }); // Comando para deletar a tabela
        try {
            yield client.send(deleteCommand); // Enviamos o comando para deletar a tabela
            console.log(`Table deleted: ${baseTableName}`);
        }
        catch (err) {
            if (err.name === "ResourceNotFoundException") {
                console.log(`Table does not exist: ${baseTableName}`); // Se a tabela não existir, fazemos um log
            }
            else {
                console.error(`Error deleting table ${baseTableName}:`, err); // Se houver algum erro a mais, fazemos um log do erro
            }
        }
    });
}
function deleteAllTables() {
    return __awaiter(this, void 0, void 0, function* () {
        const listTablesCommand = new client_dynamodb_1.ListTablesCommand({}); // Comando para listar todas as tabelas
        const { TableNames } = yield client.send(listTablesCommand); // Desestruturamos os nomes das tabelas
        if (TableNames && TableNames.length > 0) { // Se houver tabelas
            for (const tableName of TableNames) { // Para cada tabela
                yield deleteTable(tableName); // Deletamos a tabela
                yield new Promise((resolve) => setTimeout(resolve, 800)); // Esperamos 800ms (para deletar outra)
            }
        }
    });
}
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield deleteAllTables(); // Deletamos todas as tabelas
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        yield createTables(); // Criamos as tabelas do nosso app
        const seedDataPath = path_1.default.join(__dirname, "./data"); // Carregamos os JSONs do diretório data
        const files = fs_1.default
            .readdirSync(seedDataPath)
            .filter((file) => file.endsWith(".json"));
        for (const file of files) { // Para cada um dos arquivos do diretório data,
            const tableName = path_1.default.basename(file, ".json"); // Pegamos o path do JSON
            const filePath = path_1.default.join(seedDataPath, file);
            yield seedData(tableName, filePath); // Adicionamos os dados do JSON no banco de dados correspondente ao arquivo
        }
    });
}
if (require.main === module) {
    seed().catch((error) => {
        console.error("Failed to run seed script:", error);
    });
}
