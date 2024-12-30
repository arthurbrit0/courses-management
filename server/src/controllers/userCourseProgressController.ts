import { getAuth } from '@clerk/express';
import { Request, Response } from 'express';
import UserCourseProgress from '../models/userCourseProgressModel';
import Course from '../models/courseModel';
import { calculateOverallProgress, mergeSections } from '../utils/utils'

export const getUserEnrolledCourses = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId } = req.params;
    const auth = getAuth(req);
    
    if(!auth || auth.userId !== userId) {
        res.status(403).json({ message: 'Não autorizado' });
        return;
    }

    try {
        const enrolledCourses = await UserCourseProgress.query('userId').eq(userId).exec();
        const courseIds = enrolledCourses.map((item: any) => item.courseId);
        const courses = await Course.batchGet(courseIds)
        res.json({
            message: "Cursos do usuário obtidos com sucesso",
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao obter cursos do usuário",
            error
        })
    }
}

export const getUserCourseProgress = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId, courseId } = req.params;

    try {
        const courseProgress = await UserCourseProgress.get({ userId, courseId });
        res.json({
            message: "Progresso do curso obtido com sucesso",
            data: courseProgress
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao obter cursos do usuário",
            error
        })
    }
}

export const updateUserCourseProgress = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId, courseId } = req.params;
    const progressData = req.body;

    try {
        let progress = await UserCourseProgress.get({ userId, courseId });
        if (!progress) {
            progress = new UserCourseProgress({ 
                userId, 
                courseId, 
                enrollmentData: new Date().toISOString(),
                overallProgress: 0,
                sections: progressData.sections || [],
                lastAccessedTimestamp: new Date().toISOString()
            });
        } else {
            progress.sections = mergeSections(
                progress.sections,
                progressData.sections || []
            );

            progress.lastAccessedTimestamp = new Date().toISOString();
            progress.overallProgress = calculateOverallProgress(progress.sections);
        }

        await progress.save();

        res.json({
            message: "",
            data: progress
        })

    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar o progresso do usuário no curso",
            error
        })
    }
}