import { Request, Response } from 'express';
import Course from '../models/courseModel';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from '@clerk/express';

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

export const createCourse = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { teacherId, teacherName } = req.body;

        if(!teacherId || !teacherName) {
            res.status(400).json({
                message: "ID e nome do Professor são obrigatórios."
            });
            return;
        }

        const newCourse = new Course({
            courseId: uuidv4(),
            teacherId,
            teacherName,
            title: "Curso sem título",
            description: "",
            category: "Sem categoria",
            image: "",
            price: 0,
            level: "Iniciante",
            status: "Rascunho",
            sections: [],
            enrollments: [],
        })

        await newCourse.save();

        res.status(201).json({
            message: "Curso criado com sucesso",
        })

    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar o curso",
            error
        })
    }
}

export const updateCourse = async (
    req: Request,
    res: Response,
): Promise<void> => {

    const { courseId } = req.params;
    const updateData = {...req.body};
    const { userId } = getAuth(req);

    try {
        const course = await Course.get(courseId);
        if (!course) {
            res.status(404).json({
                message: "Curso não encontrado",
            });
            return;
        }

        if (course.teacherId !== userId) {
            res.status(403).json({
                message: "Você não tem permissão para atualizar este curso"
            });
            return;
        }

        if (updateData.price) {
            const price = parseInt(updateData.price);
            if (isNaN(price)) {
                res.status(400).json({
                    message: "Preço deve ser um número"
                });
                return;
            }
            updateData.price = price * 100; // armazenar em centavos
        }

        if (updateData.sections) {
            const sectionsData = typeof updateData.sections === "string" ?
            JSON.parse(updateData.sections) : updateData.sections;

            updateData.sections = sectionsData.map((section: any) => ({
                ...section,
                sectionId: section.sectionId || uuidv4(),
                chapter: section.chapters.map((chapter: any) => ({
                    ...chapter,
                    chapterId: chapter.chapterId || uuidv4()
                }))
            }));
        }

        Object.assign(course, updateData);  // atualizando o curso com os novos dados 

        await course.save();

        res.status(200).json({
            message: "Curso atualizado com sucesso",
            data: course
        })

    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar o curso",
            error
        })
    }
}

export const deleteCourse = async (
    req: Request,
    res: Response,
): Promise<void> => {

    const { courseId } = req.params;
    const { userId } = getAuth(req);

    try {
        const course = await Course.get(courseId);
        if (!course) {
            res.status(404).json({
                message: "Curso não encontrado",
            });
            return;
        }

        if (course.teacherId !== userId) {
            res.status(403).json({
                message: "Você não tem permissão para deletar este curso"
            });
            return;
        }

        await Course.delete(courseId)

        res.status(200).json({
            message: "Curso deletado com sucesso",
            data: course
        })

    } catch (error) {
        res.status(500).json({
            message: "Erro ao deletar o curso",
            error
        })
    }
}