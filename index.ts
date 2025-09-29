export interface MessageRegistry {
    [messageName: string]: {
        in: any;
        out: any;
    };
}

export type Handler<TInput, TOutput> = (message: TInput) => TOutput | Promise<TOutput>;

export class Bus<TRegistry extends MessageRegistry = MessageRegistry> {
    private handlers = new Map<keyof TRegistry, Handler<any, any>>();

    handle<K extends keyof TRegistry>(
        message: K,
        handler: Handler<TRegistry[K]['in'], TRegistry[K]['out']>
    ): this {
        if (this.handlers.has(message)) {
            throw new Error(`Handler for '${String(message)}' already exists`);
        }
        this.handlers.set(message, handler);
        return this;
    }

    async execute<K extends keyof TRegistry>(
        message: K,
        data: TRegistry[K]['in']
    ): Promise<TRegistry[K]['out']> {
        const handler = this.handlers.get(message);
        if (!handler) {
            throw new Error(`No handler registered for message: ${String(message)}`);
        }
        return handler(data);
    }
}

export function createBus<T extends MessageRegistry>(): Bus<T> {
    return new Bus<T>();
}
