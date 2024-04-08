import {dirname, isAbsolute, join } from "path";
import {promises} from "node:fs";

export class FileService{
    private async isExist(path:string):Promise<boolean>{
        try{
            await promises.stat(path);
            return true;
        }catch {
            return false;
        }
    }

    public getFilePath(path: string, name: string, ext: string): any {
        if (!isAbsolute(path)){
            path = join(__dirname + '/' + path);
        }
        return join(dirname(path) + '/' + name+ '.' + ext);
    }

    async deleteFileIfExists(path: string){
        if (await this.isExist(path)){
            promises.unlink(path);
        }
    }
}