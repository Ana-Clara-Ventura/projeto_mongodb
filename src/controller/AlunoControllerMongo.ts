// AlunoControllerMongo.ts
import { Request, Response } from "express";
import { DataBaseModelMongo } from "../model/DataBaseModelMongo";
import { MongoClient, ObjectId } from "mongodb";


interface AlunoDTO {
    idAluno: string;
    nome: string;
    sobrenome: string;
    dataNascimento?: Date;
    endereco?: string;
    email?: string;
    celular: string;
}

/**
 * Controlador para operações relacionadas aos alunos.
 */
class AlunoControllerMongo {
    private static collectionName = "alunos"; // Nome da coleção no MongoDB

    /**
     * Lista todos os alunos.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de alunos em formato JSON.
     */
    static async todos(req: Request, res: Response) {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const alunos = await db.collection(AlunoControllerMongo.collectionName).find().toArray();
            res.status(200).json(alunos);
        } catch (error) {
            console.error(`Erro ao listar alunos: ${error}`);
            res.status(400).json("Erro ao recuperar as informações do Aluno");
        }
    }

    /**
     * Cadastra um novo aluno.
     * @param req Objeto de requisição HTTP com os dados do aluno.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: AlunoDTO = req.body;
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);

            const result = await db.collection(AlunoControllerMongo.collectionName).insertOne(dadosRecebidos);

            if (result.insertedId) {
                res.status(200).json(`Aluno cadastrado com sucesso. ID: ${result.insertedId}`);
            } else {
                res.status(400).json("Não foi possível cadastrar o aluno no banco de dados");
            }
        } catch (error) {
            console.error(`Erro ao cadastrar o aluno: ${error}`);
            res.status(400).json("Erro ao cadastrar o aluno");
        }
    }

    /**
     * Remove um aluno.
     * @param req Objeto de requisição HTTP com o ID do aluno a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idAluno = req.params.id; // ID do aluno passado na URL
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);

            const result = await db.collection(AlunoControllerMongo.collectionName).deleteOne({ _id: new ObjectId(idAluno) });

            if (result.deletedCount) {
                return res.status(200).json("Aluno removido com sucesso");
            } else {
                return res.status(404).json("Aluno não encontrado");
            }
        } catch (error) {
            console.error(`Erro ao remover o aluno: ${error}`);
            return res.status(500).json("Erro ao remover o aluno");
        }
    }

    /**
     * Método para atualizar o cadastro de um aluno.
     * 
     * @param req Objeto de requisição do Express, contendo os dados atualizados do aluno
     * @param res Objeto de resposta do Express
     * @returns Retorna uma resposta HTTP indicando sucesso ou falha na atualização
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const idAluno = req.params.id; // ID do aluno passado na URL
            const dadosRecebidos: AlunoDTO = req.body;
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);

            const result = await db.collection(AlunoControllerMongo.collectionName).updateOne(
                { _id: new ObjectId(idAluno) }, // Filtro
                { $set: dadosRecebidos } // Atualizações
            );

            if (result.matchedCount) {
                return res.status(200).json("Cadastro atualizado com sucesso");
            } else {
                return res.status(404).json("Aluno não encontrado");
            }
        } catch (error) {
            console.error(`Erro ao atualizar o aluno: ${error}`);
            return res.status(500).json("Erro ao atualizar o aluno");
        }
    }
}

export default AlunoControllerMongo;
