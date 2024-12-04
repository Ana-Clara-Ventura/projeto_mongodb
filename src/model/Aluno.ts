//Aluno.ts
import { DataBaseModelMongo } from "./DataBaseModelMongo";
import { ObjectId } from "mongodb";


export class Aluno {
    private idAluno: string = ''; // ID no formato string para MongoDB
    private nome: string;
    private sobrenome: string;
    private dataNascimento: Date;
    private endereco: string;
    private email: string;
    private celular: string;

    /**
     * Construtor da classe Aluno
     *
     * @param nome Nome do Aluno
     * @param sobrenome Sobrenome do Aluno
     * @param dataNascimento Data de nascimento do Aluno
     * @param endereco Endereço do Aluno
     * @param email Email do Aluno
     * @param celular Celular do Aluno
     */
    public constructor(nome: string, sobrenome: string, dataNascimento: Date, endereco: string, email: string, celular: string) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.dataNascimento = dataNascimento;
        this.endereco = endereco;
        this.email = email;
        this.celular = celular;
    }

    // Métodos GETTERS and SETTERS
    public getIdAluno(): string {
        return this.idAluno;
    }

    public setIdAluno(id: string): void {
        this.idAluno = id;
    }

    public getNome() {
        return this.nome;
    }

    public setNome(nome: string) {
        this.nome = nome;
    }

    public getSobrenome() {
        return this.sobrenome;
    }

    public setSobrenome(sobrenome: string) {
        this.sobrenome = sobrenome;
    }

    public getDataNascimento() {
        return this.dataNascimento;
    }

    public setDataNascimento(dataNascimento: Date) {
        this.dataNascimento = dataNascimento;
    }

    public getEndereco() {
        return this.endereco;
    }

    public setEndereco(endereco: string) {
        this.endereco = endereco;
    }

    public getEmail() {
        return this.email;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public getCelular() {
        return this.celular;
    }

    public setCelular(celular: string) {
        this.celular = celular;
    }

    // CRUD utilizando MongoDB

    /**
     * Lista todos os alunos cadastrados no banco de dados
     * @returns Lista de alunos ou null em caso de erro
     */
    static async listarAlunos(): Promise<Array<any> | null> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const alunos = await db.collection("alunos").find().toArray();
            return alunos;
        } catch (error) {
            console.error(`Erro ao listar alunos: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um novo aluno no banco de dados
     * @param aluno Objeto Aluno contendo as informações a serem cadastradas
     * @returns ID do aluno cadastrado ou null em caso de erro
     */
    static async cadastrarAluno(aluno: Aluno): Promise<string | null> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("alunos").insertOne({
                nome: aluno.getNome(),
                sobrenome: aluno.getSobrenome(),
                dataNascimento: aluno.getDataNascimento(),
                endereco: aluno.getEndereco(),
                email: aluno.getEmail(),
                celular: aluno.getCelular(),
            });

            return result.insertedId.toString();
        } catch (error) {
            console.error(`Erro ao cadastrar aluno: ${error}`);
            return null;
        }
    }

    /**
     * Remove um aluno do banco de dados
     * @param idAluno ID do aluno a ser removido
     * @returns Boolean indicando se a remoção foi bem-sucedida
     */
    static async removerAluno(idAluno: string): Promise<Boolean> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
            const result = await db.collection("alunos").deleteOne({ _id: new ObjectId(idAluno) });
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Erro ao remover aluno: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza os dados de um aluno no banco de dados
     * @param aluno Objeto do tipo Aluno com os novos dados
     * @returns Boolean indicando se a atualização foi bem-sucedida
     */
    static async atualizarCadastroAluno(
        idAluno: ObjectId,
        dadosAtualizados: {
            nome: string;
            sobrenome: string;
            dataNascimento?: Date;
            endereco?: string;
            email?: string;
            celular: string;
        }
    ): Promise<boolean> {
        try {
            const db = await new DataBaseModelMongo().getDb(process.env.DB_NAME as string);
    
            // Realiza a atualização no MongoDB
            const result = await db.collection("alunos").updateOne(
                { _id: idAluno }, // Filtro pelo ID
                { $set: dadosAtualizados } // Atualiza os campos recebidos
            );
    
            // Retorna true se ao menos um documento foi atualizado
            return result.matchedCount > 0;
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            return false;
        }
    }
}