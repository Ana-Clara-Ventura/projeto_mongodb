//EmprestimoControllerMongo.ts
import { Request, Response } from "express";
import { Emprestimo } from "../model/Emprestimo";
import { ObjectId } from "mongodb";

interface EmprestimoDTO {
    idAluno: string; // IDs como strings para o MongoDB
    idLivro: string;
    dataEmprestimo: string;
    dataDevolucao: string;
    statusEmprestimo: string;
}

class EmprestimoControllerMongo {
    /**
     * Lista todos os empréstimos.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeEmprestimos = await Emprestimo.listarEmprestimos();

            if (!listaDeEmprestimos || listaDeEmprestimos.length === 0) {
                return res.status(404).json({ message: "Nenhum empréstimo encontrado." });
            }

            return res.status(200).json(listaDeEmprestimos);
        } catch (error) {
            console.error("Erro ao listar empréstimos:", error);
            return res.status(500).json({ message: "Erro ao listar os empréstimos." });
        }
    }

    /**
     * Cadastra um novo empréstimo.
     */
    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: EmprestimoDTO = req.body;

            if (!dadosRecebidos.idAluno || !dadosRecebidos.idLivro || !dadosRecebidos.dataEmprestimo || !dadosRecebidos.dataDevolucao || !dadosRecebidos.statusEmprestimo) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios." });
            }

            const novoEmprestimo = await Emprestimo.cadastrarEmprestimo(
                dadosRecebidos.idAluno,
                dadosRecebidos.idLivro,
                new Date(dadosRecebidos.dataEmprestimo),
                new Date(dadosRecebidos.dataDevolucao),
                dadosRecebidos.statusEmprestimo
            );

            return res.status(201).json({ message: "Empréstimo cadastrado com sucesso", idEmprestimo: novoEmprestimo });
        } catch (error) {
            console.error("Erro ao cadastrar empréstimo:", error);
            return res.status(500).json({ message: "Erro ao cadastrar o empréstimo." });
        }
    }

    /**
     * Atualiza um empréstimo existente.
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const idEmprestimo = req.params.id;
            const dadosRecebidos: EmprestimoDTO = req.body;

            if (!idEmprestimo || !dadosRecebidos.idAluno || !dadosRecebidos.idLivro || !dadosRecebidos.dataEmprestimo || !dadosRecebidos.dataDevolucao || !dadosRecebidos.statusEmprestimo) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios." });
            }

            const emprestimoAtualizado = await Emprestimo.atualizarEmprestimo(
                idEmprestimo,
                dadosRecebidos.idAluno,
                dadosRecebidos.idLivro,
                new Date(dadosRecebidos.dataEmprestimo),
                new Date(dadosRecebidos.dataDevolucao),
                dadosRecebidos.statusEmprestimo
            );

            return res.status(200).json({ message: "Empréstimo atualizado com sucesso", idEmprestimo: emprestimoAtualizado });
        } catch (error) {
            console.error("Erro ao atualizar empréstimo:", error);
            return res.status(500).json({ message: "Erro ao atualizar o empréstimo." });
        }
    }
}

export default EmprestimoControllerMongo;
