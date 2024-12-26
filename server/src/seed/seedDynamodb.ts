import {
  DynamoDBClient,
  DeleteTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import fs from "fs";
import path from "path";
import dynamoose from "dynamoose";
import pluralize from "pluralize";
import Transaction from "../models/transactionModel";
import Course from "../models/courseModel";
import UserCourseProgress from "../models/userCourseProgressModel";
import dotenv from "dotenv";

dotenv.config();
let client: DynamoDBClient;

/* Configuração do DynamoDB */
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();                // Criando uma instância do DynamoDB local se não estivermos em produção
  client = new DynamoDBClient({             // Criando um cliente do DynamoDB local
    endpoint: "http://localhost:8000",      // Definindo o endpoint local
    region: "us-east-2",
    credentials: {
      accessKeyId: "dummyKey123",
      secretAccessKey: "dummyKey123",
    },
  });
} else {                                    // Se estivermos em produção, criamos um cliente do DynamoDB na AWS
  client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-2",
  });
}

/* Avisos de Supress Tag do DynamoDB */
const originalWarn = console.warn.bind(console);
console.warn = (message, ...args) => {
  if (
    !message.includes("Tagging is not currently supported in DynamoDB Local")
  ) {
    originalWarn(message, ...args);
  }
};

async function createTables() {                                   // Função para criar as tabelas no DynamoDB
  const models = [Transaction, UserCourseProgress, Course];       // Array com os modelos que queremos criar (Transacao, progresso no curso e curso)

  for (const model of models) {                                   // Para cada modelo no array de modelos
    const tableName = model.name;                                 // Pegamos o nome do modelo que importamos
    const table = new dynamoose.Table(tableName, [model], {       // Criamos uma nova tabela no banco de dados com o nome do modelo e o modelo
      create: true,
      update: true,
      waitForActive: true,
      throughput: { read: 5, write: 5 },
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await table.initialize();
      console.log(`Table created and initialized: ${tableName}`);  // Fazemos um log da tabela criada
    } catch (error: any) {
      console.error(
        `Error creating table ${tableName}:`,                      // Capturamos qualquer erro que aconteça na criação da tabela
        error.message,
        error.stack
      );
    }
  }
}

async function seedData(tableName: string, filePath: string) {     // Função para criar a seed data
  const data: { [key: string]: any }[] = JSON.parse(               // Lemos o arquivo JSON com os dados que queremos adicionar
    fs.readFileSync(filePath, "utf8")
  );

  const formattedTableName = pluralize.singular(                   // Formatamos o nome da tabela para o singular
    tableName.charAt(0).toUpperCase() + tableName.slice(1)
  );

  console.log(`Seeding data to table: ${formattedTableName}`);     // Fazemos um log da tabela que estamos adicionando os dados

  for (const item of data) {                                       // Para cada dado no arquivo JSON,
    try {
      await dynamoose.model(formattedTableName).create(item);      // Criamos um novo item no banco de dados na tabela que passamos como parametro
    } catch (err) {
      console.error(
        `Unable to add item to ${formattedTableName}. Error:`,     // Se houver algum erro, fazemos um log do erro
        JSON.stringify(err, null, 2)
      );
    }
  }

  console.log(
    "\x1b[32m%s\x1b[0m",
    `Successfully seeded data to table: ${formattedTableName}`
  );
}

async function deleteTable(baseTableName: string) {                           // Função para deletar uma tabela
  let deleteCommand = new DeleteTableCommand({ TableName: baseTableName });   // Comando para deletar a tabela
  try {
    await client.send(deleteCommand);                                         // Enviamos o comando para deletar a tabela
    console.log(`Table deleted: ${baseTableName}`);
  } catch (err: any) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`Table does not exist: ${baseTableName}`);                  // Se a tabela não existir, fazemos um log
    } else {
      console.error(`Error deleting table ${baseTableName}:`, err);           // Se houver algum erro a mais, fazemos um log do erro
    }
  }
}

async function deleteAllTables() {                                            // Função para deletar todas as tabelas
  const listTablesCommand = new ListTablesCommand({});                        // Comando para listar todas as tabelas
  const { TableNames } = await client.send(listTablesCommand);                // Desestruturamos os nomes das tabelas

  if (TableNames && TableNames.length > 0) {                                  // Se houver tabelas
    for (const tableName of TableNames) {                                     // Para cada tabela
      await deleteTable(tableName);                                           // Deletamos a tabela
      await new Promise((resolve) => setTimeout(resolve, 800));               // Esperamos 800ms (para deletar outra)
    }
  }
}

export default async function seed() {                                        // Função de seed em si
  await deleteAllTables();                                                    // Deletamos todas as tabelas
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await createTables();                                                       // Criamos as tabelas do nosso app

  const seedDataPath = path.join(__dirname, "./data");                        // Carregamos os JSONs do diretório data
  const files = fs
    .readdirSync(seedDataPath)
    .filter((file) => file.endsWith(".json"));

  for (const file of files) {                                                 // Para cada um dos arquivos do diretório data,
    const tableName = path.basename(file, ".json");                           // Pegamos o path do JSON
    const filePath = path.join(seedDataPath, file);
    await seedData(tableName, filePath);                                      // Adicionamos os dados do JSON no banco de dados correspondente ao arquivo
  }
}

if (require.main === module) {
  seed().catch((error) => {
    console.error("Failed to run seed script:", error);
  });
}
