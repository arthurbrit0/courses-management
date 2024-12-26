import { Schema, model } from "dynamoose";

const commentSchema = new Schema({      // Schema para os comentários de um vídeo
  commentId: {                          // ID do comentário
    type: String,
    required: true,
  },
  userId: {                             // ID do usuário que fez o comentário
    type: String,
    required: true,
  },
  text: {                               // Texto do comentário               
    type: String,
    required: true,
  },
  timestamp: {
    type: String,                       // Timestamp do comentário
    required: true,
  },
});

const chapterSchema = new Schema({      // Schema para os capítulos de um curso
  chapterId: {                          // ID do capítulo             
    type: String,
    required: true,
  },
  type: {                               // Tipo do capítulo (Texto, Quiz, Vídeo)
    type: String,                       
    enum: ["Texto", "Quiz", "Vídeo"],    // Enumerador para os tipos de capítulo, que pode ser texto, quiz ou video
    required: true,
  },
  title: {                              // Título do capítulo
    type: String,   
    required: true,
  },
  content: {                            // Conteúdo do capítulo
    type: String,
    required: true,
  },
  comments: {                           // Comentários do capítulo, que é um array de comentários
    type: Array,
    schema: [commentSchema],
  },
  video: {                              // URL do vídeo do capítulo
    type: String,
  },
});

const sectionSchema = new Schema({      // Schema para as seções de um curso
  sectionId: {                          // ID da seção
    type: String,
    required: true,
  },
  sectionTitle: {                       // Título da seção                 
    type: String,
    required: true,
  },
  sectionDescription: {                 // Descrição da seção
    type: String,
  },
  chapters: {                           // Capítulos da seção, que é um array de capítulos
    type: Array,
    schema: [chapterSchema],
  },
});

const courseSchema = new Schema(        // Schema para os cursos
  {
    courseId: {                         // ID do curso            
      type: String,
      hashKey: true,
      required: true,
    },
    teacherId: {                        // ID do professor que criou o curso            
      type: String,
      required: true,
    },
    teacherName: {                      // Nome do professor que criou o curso
      type: String,
      required: true,
    },
    title: {                            // Título do curso              
      type: String,
      required: true,
    },
    description: {                      // Descrição do curso           
      type: String,
    },
    category: {                         // Categoria do curso          
      type: String,
      required: true,
    },
    image: {                            // URL da imagem do curso (opcional)         
      type: String,
    },
    price: {                            // Preço do curso (opcional)
      type: Number,
    },
    level: {                            // Nível do curso (Iniciante, Intermediário, Avançado)
      type: String,
      required: true,
      enum: ["Iniciante", "Intermediário", "Avançado"],
    },
    status: {                           // Status do curso (Rascunho, Publicado)
      type: String,
      required: true,
      enum: ["Rascunho", "Publicado"],
    },
    sections: {                         // Seções do curso, que é um array do schema seção
      type: Array,
      schema: [sectionSchema],
    },
    enrollments: {                      // Matrículas no curso, que é um array de usuários
      type: Array,
      schema: [
        new Schema({                    // Schema o usuário, pegando seu ID         
          userId: {
            type: String,
            required: true,
          },
        }),
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", courseSchema);   // Criando um model para os cursos, usando o courseSchema
export default Course;
