export class ConsoleLogger {
    static getInstance() {
        if (!ConsoleLogger.instance) {
            ConsoleLogger.instance = new ConsoleLogger();
        }
        return ConsoleLogger.instance;
    }
    end() {
        console.log('End');
    }
    error(...args) {
        console.log(...args);
    }
    log(...args) {
        console.log(...args);
    }
}
