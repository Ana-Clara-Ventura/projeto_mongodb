// upload.ts
import multer from "multer";
import path from "path";

// Configuração de armazenamento
const storage = multer.diskStorage({
    // Define o diretório onde as imagens serão armazenadas
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Substitua "uploads/" pelo caminho desejado
    },
    // Define o nome do arquivo armazenado
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});

// Filtro para validar o tipo de arquivo
const fileFilter = (req: any, file: any, cb: any) => {
    // Verifica se o tipo do arquivo começa com "image/"
    if (file.mimetype.startsWith("image/")) {
        cb(null, true); // Aceita o arquivo
    } else {
        cb(new Error("Apenas arquivos de imagem são permitidos."), false); // Rejeita o arquivo
    }
};

// Middleware de upload
export const upload = multer({
    storage, // Configuração de armazenamento
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por arquivo
    fileFilter, // Filtro de tipo de arquivo
});
