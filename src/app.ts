import { server } from "./server";
import { DataBaseModelMongo } from "./model/DataBaseModelMongo";
import dotenv from 'dotenv';

dotenv.config();

// Define a porta que o servidor vai escutar as requisições
const port: number = parseInt(process.env.SERVER_PORT as string, 10);

// Instancia o modelo de banco de dados
const dbModel = new DataBaseModelMongo();

async function startApp() {
    try {
        // Testa a conexão com o banco de dados
        const isConnected = await dbModel.testeConexao();
        if (isConnected) {
            console.clear();
            console.log("Conexão com o banco de dados realizada com sucesso!");
            
            // Inicia o servidor
            server.listen(port, () => {
                console.log(`Servidor iniciado no endereço http://localhost:${port}`);
            });

            // Trata o encerramento da aplicação
            process.on("SIGINT", async () => {
                console.log("\nEncerrando a aplicação...");
                await dbModel.closeConnection(); // Fecha a conexão com o banco de dados
                console.log("Conexão com o banco de dados encerrada.");
                process.exit(0);
            });
        } else {
            console.error("Erro ao conectar com o banco de dados. O servidor não será iniciado.");
        }
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}

// Executa a inicialização da aplicação
startApp();