//LivroControllerMongo.ts
import { Request, Response } from "express";
import { DataBaseModelMongo } from "../model/DataBaseModelMongo";
import { MongoClient, ObjectId } from "mongodb";
import { Livro } from "../model/Livro";

interface LivroDTO {
    titulo: string;
    autor: string;
    editora: string;
    anoPublicacao?: number;
    isbn?: string;
    quantTotal: number;
    quantDisponivel: number;
    valorAquisicao?: number;
    statusLivroEmprestado?: string;
}

/**
 * Controlador para operações relacionadas aos Livros.
 */
class LivroControllerMongo {
    private static collectionName = "livros"; // Nome da coleção no MongoDB

    /**
     * Lista todos os livros.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de livros em formato JSON.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const livros = await Livro.listarLivros();
            res.status(200).json(livros);
        } catch (error) {
            console.error(`Erro ao listar livros: ${error}`);
            res.status(400).json("Erro ao recuperar as informações dos livros");
        }
    }

    /**
     * Cadastra um novo livro.
     * @param req Objeto de requisição HTTP com os dados do livro.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: LivroDTO = req.body;

            // Criação de um novo objeto Livro
            const novoLivro = new Livro(
                dadosRecebidos.titulo,
                dadosRecebidos.autor,
                dadosRecebidos.editora,
                (dadosRecebidos.anoPublicacao ?? 0).toString(),
                dadosRecebidos.isbn ?? "",
                dadosRecebidos.quantTotal,
                dadosRecebidos.quantDisponivel,
                dadosRecebidos.valorAquisicao ?? 0,
                dadosRecebidos.statusLivroEmprestado ?? "Disponível"
            );

            const result = await Livro.cadastrarLivro(novoLivro);

            if (result) {
                return res.status(200).json(`Livro cadastrado com sucesso`);
            } else {
                return res.status(400).json("Não foi possível cadastrar o livro no banco de dados");
            }
        } catch (error) {
            console.error(`Erro ao cadastrar o livro: ${error}`);
            res.status(400).json("Erro ao cadastrar o livro");
        }
    }

    /**
     * Remove um livro.
     * @param req Objeto de requisição HTTP com o ID do livro a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idLivro = req.params.id;
            const result = await Livro.removerLivro(idLivro);

            if (result) {
                return res.status(200).json("Livro removido com sucesso");
            } else {
                return res.status(404).json("Livro não encontrado");
            }
        } catch (error) {
            console.error(`Erro ao remover o livro: ${error}`);
            return res.status(500).json("Erro ao remover o livro");
        }
    }

    /**
     * Atualiza os dados de um livro.
     * @param req Objeto de requisição HTTP com os dados atualizados do livro.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const idLivro = req.params.id;
            const dadosRecebidos: LivroDTO = req.body;

            const livroAtualizado = new Livro(
                dadosRecebidos.titulo,
                dadosRecebidos.autor,
                dadosRecebidos.editora,
                (dadosRecebidos.anoPublicacao ?? 0).toString(),
                dadosRecebidos.isbn ?? "",
                dadosRecebidos.quantTotal,
                dadosRecebidos.quantDisponivel,
                dadosRecebidos.valorAquisicao ?? 0,
                dadosRecebidos.statusLivroEmprestado ?? "Disponível"
            );

            livroAtualizado.setIdLivro(idLivro);

            const result = await Livro.atualizarCadastroLivro(livroAtualizado);

            if (result) {
                return res.status(200).json("Cadastro atualizado com sucesso");
            } else {
                return res.status(404).json("Livro não encontrado");
            }
        } catch (error) {
            console.error(`Erro ao atualizar o livro: ${error}`);
            return res.status(500).json("Erro ao atualizar o livro");
        }
    }
}

export default LivroControllerMongo;