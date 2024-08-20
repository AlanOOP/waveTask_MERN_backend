import { isValidObjectId } from "mongoose";

export const isValidId = (id: string): boolean => isValidObjectId(id)
