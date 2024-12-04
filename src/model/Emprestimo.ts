// Emprestimo.ts
import { DataBaseModelMongo } from "./DataBaseModelMongo";
import { ObjectId } from "mongodb";

export class Emprestimo {
    private idEmprestimo: string = "";
    private idAluno: string;
    private idLivro: string;
    private dataEmprestimo: Date;
    private dataDevolucao: Date;
    private statusEmprestimo: string;

    public constructor(
        idAluno: string,
        idLivro: string,
        dataEmprestimo: Date,
        dataDevolucao: Date,
        statusEmprestimo: string
    ) {
        this.idAluno = idAluno;
        this.idLivro = idLivro;
        this.dataEmprestimo = dataEmprestimo;
        this.dataDevolucao = dataDevolucao;
        this.statusEmprestimo = statusEmprestimo;
    }

    public getIdEmprestimo(): string {
        return this.idEmprestimo;
    }

    public setIdEmprestimo(id: string): void {
        this.idEmprestimo = id;
    }

    static async listarEmprestimos(): Promise<any[]> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            return await db.collection("emprestimos").find().toArray();
        } catch (error) {
            console.error(`Erro ao listar empréstimos: ${error}`);
            return [];
        }
    }

    static async cadastrarEmprestimo(
        idAluno: string,
        idLivro: string,
        dataEmprestimo: Date,
        dataDevolucao: Date,
        statusEmprestimo: string
    ): Promise<string | null> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("emprestimos").insertOne({
                idAluno: new ObjectId(idAluno),
                idLivro: new ObjectId(idLivro),
                dataEmprestimo,
                dataDevolucao,
                statusEmprestimo,
            });

            return result.insertedId.toString();
        } catch (error) {
            console.error(`Erro ao cadastrar empréstimo: ${error}`);
            return null;
        }
    }

    static async atualizarEmprestimo(
        idEmprestimo: string,
        idAluno: string,
        idLivro: string,
        dataEmprestimo: Date,
        dataDevolucao: Date,
        statusEmprestimo: string
    ): Promise<boolean> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("emprestimos").updateOne(
                { _id: new ObjectId(idEmprestimo) },
                {
                    $set: {
                        idAluno: new ObjectId(idAluno),
                        idLivro: new ObjectId(idLivro),
                        dataEmprestimo,
                        dataDevolucao,
                        statusEmprestimo,
                    },
                }
            );

            return result.matchedCount > 0;
        } catch (error) {
            console.error(`Erro ao atualizar empréstimo: ${error}`);
            return false;
        }
    }
}
