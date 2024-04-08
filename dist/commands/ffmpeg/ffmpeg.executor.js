var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { spawn } from "child_process";
import { CommandExecutor } from "../../core/executor/command.executor.js";
import { FileService } from "../../core/files/file.service.js";
import { PromptService } from "../../core/prompt/prompt.service.js";
import { FfmpegBuilder } from "./ffmpeg.builder.js";
import { StreamHandler } from "../../core/handlers/stream.handler.js";
export class FfmpegExecutor extends CommandExecutor {
    constructor(logger) {
        super(logger);
        this.fileService = new FileService();
        this.promptService = new PromptService();
    }
    prompt() {
        return __awaiter(this, void 0, void 0, function* () {
            const width = yield this.promptService.input('Width', 'number');
            const height = yield this.promptService.input('Height', 'number');
            const path = yield this.promptService.input('Path', 'input');
            const name = yield this.promptService.input('Name', 'input');
            return { width, height, path, name };
        });
    }
    build({ width, height, path, name }) {
        const output = this.fileService.getFilePath(path, name, 'mp4');
        const args = (new FfmpegBuilder)
            .input(path)
            .setResolution(width, height)
            .output(output);
        return { command: 'ffmpeg', args, output };
    }
    spawn({ output, command, args }) {
        this.fileService.deleteFileIfExists(output);
        return spawn(command, args);
    }
    processStream(stream, logger) {
        const handler = new StreamHandler(logger);
        handler.processOutput(stream);
    }
}
