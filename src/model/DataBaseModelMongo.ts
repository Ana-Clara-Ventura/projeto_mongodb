//DataBaseModelMongo.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Classe que representa o modelo de banco de dados.
 */
export class DataBaseModelMongo {
    /**
     * URL de conexão com o banco de dados
     */
    private _uri: string;

    /**
     * Cliente do MongoDB
     */
    private _client: MongoClient;

    /**
     * Construtor da classe DatabaseModel.
     */
    constructor() {
        // URL de conexão com o MongoDB
        this._uri = process.env.MONGODB_URI || '';

        // Inicializa o cliente do MongoDB
        this._client = new MongoClient(this._uri);
    }

    /**
     * Método para testar a conexão com o banco de dados.
     *
     * @returns **true** caso a conexão tenha sido feita, **false** caso contrário
     */
    public async testeConexao(): Promise<boolean> {
        try {
            // Tenta conectar ao banco de dados
            await this._client.connect();
            console.log('MongoDB connected!');
            // Fecha a conexão (opcional aqui, pode manter aberta dependendo do uso)
            await this._client.close();
            return true;
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            return false;
        }
    }

    /**
     * Método para obter a instância do banco de dados.
     *
     * @param dbName Nome do banco de dados a ser acessado.
     * @returns Instância do banco de dados MongoDB.
     */
    public async getDb(dbName: string) {
        try {
            await this._client.connect(); // Conecta ao MongoDB
            const db = this._client.db(dbName); // Obtém o banco de dados especificado
            return db;
        } catch (error) {
            console.error('Error accessing MongoDB database:', error);
            throw error;
        }
    }

    /**
     * Método para encerrar a conexão com o banco de dados.
     */
    public async closeConnection() {
        try {
            await this._client.close();
            console.log('MongoDB connection closed.');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
        }
    }
}