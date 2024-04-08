import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import {CommandExecutor} from "../../core/executor/command.executor.js";
import {IStreamLogger} from "../../core/handlers/stream-logger.js";
import {ICommandExecFfmpeg, IFfmpegInput} from "./ffmpeg.types.js";
import {FileService} from "../../core/files/file.service.js";
import { PromptService } from "../../core/prompt/prompt.service.js";
import {FfmpegBuilder} from "./ffmpeg.builder.js";
import {StreamHandler} from "../../core/handlers/stream.handler.js";

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {
    private fileService: FileService = new FileService();
    private promptService: PromptService = new PromptService();

    constructor(logger: IStreamLogger) {
        super(logger);
    }

    protected  async prompt(): Promise<IFfmpegInput> {
        const width = await this.promptService.input<number>('Width', 'number');
        const height = await this.promptService.input<number>('Height', 'number');
        const path = await this.promptService.input<string>('Path', 'input');
        const name = await this.promptService.input<string>('Name', 'input');
        return {width, height, path, name};
    }
    protected build({width, height, path, name}: IFfmpegInput): ICommandExecFfmpeg {
        const output = this.fileService.getFilePath(path, name, 'mp4');
        const args = (new FfmpegBuilder)
            .input(path)
            .setResolution(width, height)
            .output(output)
        return {command: 'ffmpeg', args, output}
    }
    protected spawn({output, command, args}: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
        this.fileService.deleteFileIfExists(output);
        return spawn(command, args);
    }
    protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
        const handler = new StreamHandler(logger);
        handler.processOutput(stream)
    }
}

