import { Schema, model } from "dynamoose";

const transactionSchema = new Schema(       // Schema para as transações de pagamento
  {
    userId: {                               // ID do usuário que fez a transação             
      type: String,
      hashKey: true,                        // Chave primária da tabela
      required: true,
    },
    transactionId: {                        // ID da transação              
      type: String,
      rangeKey: true,                       // Chave secundária da tabela              
      required: true,
    },
    dateTime: {                             // Data e hora da transação
      type: String,
      required: true,
    },
    courseId: {                             // ID do curso que foi comprado                
      type: String,
      required: true,
      index: {                              // Índice para busca de transações por curso  
        name: "CourseTransactionsIndex",
        type: "global",
      },
    },
    paymentProvider: {                      // Provedor de pagamento (Stripe)                   
      type: String,
      enum: ["stripe"],
      required: true,
    },
    amount: Number,                         // Valor da transação
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);  // Criando um novo modelo para as transações, usando o transactionSchema
export default Transaction;
