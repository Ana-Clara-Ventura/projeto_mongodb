// Imagem.ts
import { ObjectId } from "mongodb";
import { DataBaseModelMongo } from "./DataBaseModelMongo";

export class Imagem {
    private id: string;
    private caminho: string;
    private descricao: string;

    constructor(caminho: string, descricao: string, id: string = "") {
        this.id = id;
        this.caminho = caminho;
        this.descricao = descricao;
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getCaminho(): string {
        return this.caminho;
    }

    public setCaminho(caminho: string): void {
        this.caminho = caminho;
    }

    public getDescricao(): string {
        return this.descricao;
    }

    public setDescricao(descricao: string): void {
        this.descricao = descricao;
    }

    // CRUD OPERATIONS

    static async listarImagens(): Promise<Imagem[]> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const imagens = await db.collection("imagens").find().toArray();
    
            // Converte o _id para string antes de passá-lo ao construtor
            return imagens.map(img => new Imagem(img.caminho, img.descricao, img._id.toString()));
        } catch (error) {
            console.error("Erro ao listar imagens:", error);
            return [];
        }
    }

    static async cadastrarImagem(imagem: Imagem): Promise<string | null> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("imagens").insertOne({
                caminho: imagem.getCaminho(),
                descricao: imagem.getDescricao(),
            });
            return result.insertedId.toString();
        } catch (error) {
            console.error("Erro ao cadastrar imagem:", error);
            return null;
        }
    }

    static async atualizarImagem(imagem: Imagem): Promise<boolean> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("imagens").updateOne(
                { _id: new ObjectId(imagem.getId()) },
                { $set: { caminho: imagem.getCaminho(), descricao: imagem.getDescricao() } }
            );
            return result.matchedCount > 0;
        } catch (error) {
            console.error("Erro ao atualizar imagem:", error);
            return false;
        }
    }

    static async removerImagem(id: string): Promise<boolean> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("imagens").deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Erro ao remover imagem:", error);
            return false;
        }
    }
}
