import multer from "multer";
import { randomBytes } from "node:crypto";

// multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/multer/uploads");
    },
    filename: (req, file, cb) => {
        // Extração da extensão do arquivo original:
        const fileExt = file.originalname.split(".")[1];

        // Cria um código randômico que será o nome do arquivo
        const newFileName = randomBytes(64).toString("hex");

        // Indica o novo nome do arquivo:
        cb(null, `${newFileName}.${fileExt}`);
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fileFilter(req: Express.Request, file: Express.Multer.File, cb: any) {
    const typeArray = file.mimetype.split("/");
    console.log(typeArray);
    const fileType = typeArray[1];
    console.log(fileType);
    if (
        fileType === "pdf" ||
        fileType === "png" ||
        fileType === "jpg" ||
        fileType === "jpeg"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"));
    }
}

export const upload = multer({ storage, fileFilter });
