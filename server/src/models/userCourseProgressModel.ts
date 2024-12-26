import { Schema, model } from "dynamoose";

const chapterProgressSchema = new Schema({        // Schema para o progresso de um capítulo
  chapterId: {                                    // ID do capítulo              
    type: String,
    required: true,
  },
  completed: {                                    // Booleano que verifica se o capítulo foi completado                 
    type: Boolean,
    required: true,
  },
});

const sectionProgressSchema = new Schema({        // Schema para o progresso de uma seção
  sectionId: {                                    // ID da seção
    type: String,
    required: true,
  },
  chapters: {                                     // Capítulos da seção, que é um array de progresso de capítulos
    type: Array,
    schema: [chapterProgressSchema],
  },
});

const userCourseProgressSchema = new Schema(      // Schema para o progresso de um curso de um usuário
  {
    userId: {                                     // ID do usuário
      type: String,
      hashKey: true,
      required: true,
    },
    courseId: {                                   // ID do curso que ele está fazendo
      type: String,
      rangeKey: true,
      required: true,
    },
    enrollmentDate: {                             // Data em que ele começou o curso
      type: String,
      required: true,
    },
    overallProgress: {                            // Progresso geral do curso
      type: Number,
      required: true,
    },
    sections: {                                   // Seções que o usuário já fez, que é um array de sectionProgress que, por sua vez, é um array de chapterProgress
      type: Array,
      schema: [sectionProgressSchema],
    },
    lastAccessedTimestamp: {                      // Timestamp da última vez que ele acessou o curso
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserCourseProgress = model(                 // Criando um novo modelo para o progresso de um curso de um usuário, usando o userCourseProgressSchema
  "UserCourseProgress",
  userCourseProgressSchema
);
export default UserCourseProgress;
