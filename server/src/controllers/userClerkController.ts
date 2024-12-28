import { Request, Response } from "express";
import Course from "../models/courseModel";
import { clerkClient } from "../index";

export const updateUser = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { userId } = req.params;                         
    const userData = req.body;               

    try {
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                userType: userData.publicMetadata.userType,
                settings: userData.publicMetadata.settings,
            }
        })

        res.json({                                                   
            message: "Usuário atualizado com sucesso!"                                                 
        })  

    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar o usuário.",                    
            error
        });
    }
}