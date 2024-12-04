import express from "express";
import { SERVER_ROUTES } from "./appConfig";
import AlunoControllerMongo from "./controller/AlunoControllerMongo";
import LivroControllerMongo from "./controller/LivroControllerMongo";
import EmprestimoControllerMongo from "./controller/EmprestimoControllerMongo";
import ControllerImagem from "./controller/ControllerImagem";
import { upload } from "./middlewares/upload";

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ mensagem: "Rota padrão" })
});

// CRUD Imagens
router.get(SERVER_ROUTES.LISTAR_IMAGENS, ControllerImagem.listar);
router.post(SERVER_ROUTES.NOVA_IMAGEM, upload.single("imagem"), ControllerImagem.cadastrar);
router.put(SERVER_ROUTES.ATUALIZAR_IMAGEM, upload.single("imagem"), ControllerImagem.atualizar);
router.delete(SERVER_ROUTES.REMOVER_IMAGEM, ControllerImagem.remover);

// CRUD Aluno
router.get(SERVER_ROUTES.LISTAR_ALUNOS, AlunoControllerMongo.todos);
router.post(SERVER_ROUTES.NOVO_ALUNO, AlunoControllerMongo.cadastrar);
router.delete(SERVER_ROUTES.REMOVER_ALUNO, AlunoControllerMongo.remover);
router.put(SERVER_ROUTES.ATUALIZAR_ALUNO, AlunoControllerMongo.atualizar);

//CRUD Livro
router.get(SERVER_ROUTES.LISTAR_LIVROS, LivroControllerMongo.todos);
router.post(SERVER_ROUTES.NOVO_LIVRO, LivroControllerMongo.cadastrar);
router.delete(SERVER_ROUTES.REMOVER_LIVRO, LivroControllerMongo.remover);
router.put(SERVER_ROUTES.ATUALIZAR_LIVRO, LivroControllerMongo.atualizar);

//CRUD Emprestimo
router.get(SERVER_ROUTES.LISTAR_EMPRESTIMOS, EmprestimoControllerMongo.todos);
router.post(SERVER_ROUTES.NOVO_EMPRESTIMO, EmprestimoControllerMongo.cadastrar);
router.put(SERVER_ROUTES.ATUALIZAR_EMPRESTIMO, EmprestimoControllerMongo.atualizar);

export { router }
