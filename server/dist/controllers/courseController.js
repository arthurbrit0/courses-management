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
exports.getCourse = exports.listCourses = void 0;
const courseModel_1 = __importDefault(require("../models/courseModel"));
const listCourses = (// Função para listar os cursos
req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.query; // Pegando a categoria da query da requisição
    try {
        const courses = category && category !== "all" // Se a categoria existir e não for "all"
            ? yield courseModel_1.default.scan("category").eq(category).exec() // Filtramos os cursos pela categoria
            : yield courseModel_1.default.scan().exec(); // Se a categoria for all, pegamos todos os cursos do banco de dados
        res.json({
            message: "Cursos recuperados com sucesso!", // Retornamos uma mensagem de sucesso caso dê tudo certo
            data: courses
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao recuperar os cursos.", // Caso dê erro, retornamos uma mensagem e o erro
            error
        });
    }
});
exports.listCourses = listCourses;
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Pegando o id da requisição
    try {
        const course = yield courseModel_1.default.get(id); // Pegando o curso pelo id
        if (!course) { // Se não encontrarmos o curso pelo id
            res.status(404).json({
                message: "Curso não encontrado." // Retornamos uma mensagem de erro
            });
            return;
        }
        res.json({
            message: "Curso recuperado com sucesso!", // Retornamos uma mensagem de sucesso
            data: course // E os dados do curso encontrado no banco de dados
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao recuperar o curso.", // Caso dê erro, retornamos uma mensagem e o erro
            error
        });
    }
});
exports.getCourse = getCourse;
