//Livro.ts
import { DataBaseModelMongo } from "./DataBaseModelMongo";
import { ObjectId } from "mongodb";

export class Livro {
    private idLivro: string = "";
    private titulo: string;
    private autor: string;
    private editora: string;
    private anoPublicacao: string;
    private isbn: string;
    private quantTotal: number;
    private quantDisponivel: number;
    private valorAquisicao: number;
    private statusLivroEmprestado: string;

    public constructor(
        titulo: string,
        autor: string,
        editora: string,
        anoPublicacao: string,
        isbn: string,
        quantTotal: number,
        quantDisponivel: number,
        valorAquisicao: number,
        statusLivroEmprestimo: string
    ) {
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.anoPublicacao = anoPublicacao;
        this.isbn = isbn;
        this.quantTotal = quantTotal;
        this.quantDisponivel = quantDisponivel;
        this.valorAquisicao = valorAquisicao;
        this.statusLivroEmprestado = statusLivroEmprestimo;
    }

    public getIdLivro(): string {
        return this.idLivro;
    }

    public setIdLivro(id: string): void {
        this.idLivro = id;
    }

    static async listarLivros(): Promise<any[]> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            return await db.collection("livros").find().toArray();
        } catch (error) {
            console.error(`Erro ao listar livros: ${error}`);
            return [];
        }
    }

    static async cadastrarLivro(livro: Livro): Promise<boolean> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("livros").insertOne({
                titulo: livro.titulo,
                autor: livro.autor,
                editora: livro.editora,
                anoPublicacao: livro.anoPublicacao,
                isbn: livro.isbn,
                quantTotal: livro.quantTotal,
                quantDisponivel: livro.quantDisponivel,
                valorAquisicao: livro.valorAquisicao,
                statusLivroEmprestado: livro.statusLivroEmprestado,
            });

            return result.insertedId !== null;
        } catch (error) {
            console.error(`Erro ao cadastrar livro: ${error}`);
            return false;
        }
    }

    static async removerLivro(idLivro: string): Promise<boolean> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("livros").deleteOne({ _id: new ObjectId(idLivro) });
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Erro ao remover livro: ${error}`);
            return false;
        }
    }

    static async atualizarCadastroLivro(livro: Livro): Promise<boolean> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("livros").updateOne(
                { _id: new ObjectId(livro.getIdLivro()) },
                {
                    $set: {
                        titulo: livro.titulo,
                        autor: livro.autor,
                        editora: livro.editora,
                        anoPublicacao: livro.anoPublicacao,
                        isbn: livro.isbn,
                        quantTotal: livro.quantTotal,
                        quantDisponivel: livro.quantDisponivel,
                        valorAquisicao: livro.valorAquisicao,
                        statusLivroEmprestado: livro.statusLivroEmprestado,
                    },
                }
            );

            return result.matchedCount > 0;
        } catch (error) {
            console.error(`Erro ao atualizar livro: ${error}`);
            return false;
        }
    }
}
