import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from "express";

type AsyncContext = {
    requestId: string;
};

export const asyncLocalStorage = new AsyncLocalStorage<AsyncContext>();

export const getRequestId = (): string | undefined => {
    const store = asyncLocalStorage.getStore();
    return store?.requestId;
};
