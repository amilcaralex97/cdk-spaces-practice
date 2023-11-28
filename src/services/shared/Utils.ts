import { JsonError } from "./Validator";
import { randomUUID } from "crypto";

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new JsonError(error.message);
  }
}

export function createRandomId() {
  return randomUUID();
}
