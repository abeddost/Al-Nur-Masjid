import { getPayload as getPayloadInstance } from "payload";
import config from "@/payload.config";

let cached: ReturnType<typeof getPayloadInstance> | null = null;

/** Cached Payload local-API client, shared across a request lifecycle. */
export const getPayload = () => {
  if (!cached) {
    cached = getPayloadInstance({ config });
  }
  return cached;
};
