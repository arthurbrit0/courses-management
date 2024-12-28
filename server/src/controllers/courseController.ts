import { Request, Response } from 'express';
import Course from '../models/courseModel';

export const listCourses = async (                                    // Função para listar os cursos
    req: Request, 
    res: Response
): Promise<void> => {                                                 // Retorna uma Promise do tipo void

    const { category } = req.query;                                   // Pegando a categoria da query da requisição

    try {
        const courses = category && category !== "all"                // Se a categoria existir e não for "all"
        ? await Course.scan("category").eq(category).exec()           // Filtramos os cursos pela categoria
        : await Course.scan().exec();                                 // Se a categoria for all, pegamos todos os cursos do banco de dados

        res.json({
            message: "Cursos recuperados com sucesso!",               // Retornamos uma mensagem de sucesso caso dê tudo certo
            data: courses
        })
    } catch (error) {
        res.status(500).json({
            message: "Erro ao recuperar os cursos.",                  // Caso dê erro, retornamos uma mensagem e o erro
            error
        })
    }
}

export const getCourse = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { courseId } = req.params;                                  // Pegando o id da requisição

    try {
        const course = await Course.get(courseId);                    // Pegando o curso pelo id

        if (!course) {                                                // Se não encontrarmos o curso pelo id
            res.status(404).json({
                message: "Curso não encontrado."                      // Retornamos uma mensagem de erro
            });
            return;
        }

        res.json({                                                    // Em caso de sucesso,
            message: "Curso recuperado com sucesso!",                 // Retornamos uma mensagem de sucesso
            data: course                                              // E os dados do curso encontrado no banco de dados
        })  

    } catch (error) {
        res.status(500).json({
            message: "Erro ao recuperar o curso.",                    // Caso dê erro, retornamos uma mensagem e o erro
            error
        });
    }
}