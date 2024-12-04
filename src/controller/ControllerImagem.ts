// ControllerImagem.ts
import { Request, Response } from "express";
import { Imagem } from "../model/Imagem";

class ControllerImagem {
    static async listar(req: Request, res: Response): Promise<any> {
        try {
            const imagens = await Imagem.listarImagens();
            res.status(200).json(imagens);
        } catch (error) {
            console.error("Erro ao listar imagens:", error);
            res.status(500).json({ message: "Erro ao listar imagens." });
        }
    }

    static async cadastrar(req: Request, res: Response): Promise<any> {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Arquivo de imagem é obrigatório." });
            }

            const descricao = req.body.descricao || "";
            const caminho = req.file.path;

            const novaImagem = new Imagem(caminho, descricao);
            const id = await Imagem.cadastrarImagem(novaImagem);

            if (id) {
                res.status(201).json({ message: "Imagem cadastrada com sucesso.", id });
            } else {
                res.status(400).json({ message: "Erro ao cadastrar imagem." });
            }
        } catch (error) {
            console.error("Erro ao cadastrar imagem:", error);
            res.status(500).json({ message: "Erro ao cadastrar imagem." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id;
            const descricao = req.body.descricao || "";

            if (!id || !descricao) {
                return res.status(400).json({ message: "ID e descrição são obrigatórios." });
            }

            const caminho = req.file ? req.file.path : req.body.caminho;
            const imagemAtualizada = new Imagem(caminho, descricao, id);

            const sucesso = await Imagem.atualizarImagem(imagemAtualizada);

            if (sucesso) {
                res.status(200).json({ message: "Imagem atualizada com sucesso." });
            } else {
                res.status(404).json({ message: "Imagem não encontrada." });
            }
        } catch (error) {
            console.error("Erro ao atualizar imagem:", error);
            res.status(500).json({ message: "Erro ao atualizar imagem." });
        }
    }

    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const id = req.params.id;

            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório." });
            }

            const sucesso = await Imagem.removerImagem(id);

            if (sucesso) {
                res.status(200).json({ message: "Imagem removida com sucesso." });
            } else {
                res.status(404).json({ message: "Imagem não encontrada." });
            }
        } catch (error) {
            console.error("Erro ao remover imagem:", error);
            res.status(500).json({ message: "Erro ao remover imagem." });
        }
    }
}

export default ControllerImagem;