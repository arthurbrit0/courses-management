"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamoose_1 = require("dynamoose");
const transactionSchema = new dynamoose_1.Schema(// Schema para as transações de pagamento
{
    userId: {
        type: String,
        hashKey: true, // Chave primária da tabela
        required: true,
    },
    transactionId: {
        type: String,
        rangeKey: true, // Chave secundária da tabela              
        required: true,
    },
    dateTime: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
        index: {
            name: "CourseTransactionsIndex",
            type: "global",
        },
    },
    paymentProvider: {
        type: String,
        enum: ["stripe"],
        required: true,
    },
    amount: Number, // Valor da transação
}, {
    saveUnknown: true,
    timestamps: true,
});
const Transaction = (0, dynamoose_1.model)("Transaction", transactionSchema); // Criando um novo modelo para as transações, usando o transactionSchema
exports.default = Transaction;
