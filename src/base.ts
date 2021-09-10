import fetch from "cross-fetch";
import { buildAuthHeaders, Credentials } from "./auth";
import { DEFAULT_HEADERS, DEFAULT_ORIGIN } from "./constants";
import { debugLog, timeoutThen } from "./utils";

export type RequestInitWithRetryOption = RequestInit & {
  retry?: number;
  retryInterval?: number;
};

export class Base {
  public isLive!: boolean;
  public videoId!: string;
  public channelId!: string;
  public channelName?: string;
  public title?: string;

  protected credentials?: Credentials;
  protected apiKey!: string;

  protected async postJson<T>(
    input: string,
    init?: RequestInitWithRetryOption
  ): Promise<T> {
    const errors = [];

    let remaining = init?.retry ?? 0;
    const retryInterval = init?.retryInterval ?? 1000;

    while (true) {
      try {
        const res = await this.post(input, init);
        if (res.status !== 200) {
          debugLog(`postJson(${this.videoId}):`, `status=${res.status}`);
        }
        return await res.json();
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "AbortError") throw err;

          errors.push(err);

          if (remaining > 0) {
            await timeoutThen(retryInterval);
            remaining -= 1;
            debugLog(
              `Retrying(postJson) remaining=${remaining} after=${retryInterval}`
            );
            continue;
          }

          (err as any).errors = errors;
        }
        throw err;
      }
    }
  }

  protected post(input: string, init?: RequestInit) {
    if (!input.startsWith("http")) {
      input = DEFAULT_ORIGIN + input;
    }
    const parsedUrl = new URL(input);

    if (!parsedUrl.searchParams.has("key")) {
      parsedUrl.searchParams.append("key", this.apiKey);
    }

    const authHeaders = buildAuthHeaders(this.credentials);
    const headers = {
      ...DEFAULT_HEADERS,
      ...authHeaders,
      ...init?.headers,
      "Content-Type": "application/json",
    };

    // debugLog("POST", parsedUrl.toString(), init?.body);

    return fetch(parsedUrl.toString(), {
      ...init,
      method: "POST",
      headers,
    });
  }

  protected get(input: string, init?: RequestInit) {
    if (!input.startsWith("http")) {
      input = DEFAULT_ORIGIN + input;
    }
    const parsedUrl = new URL(input);

    if (
      !parsedUrl.searchParams.has("key") &&
      !parsedUrl.pathname.includes("watch/v")
    ) {
      parsedUrl.searchParams.append("key", this.apiKey);
    }

    const authHeaders = buildAuthHeaders(this.credentials);
    const headers = {
      ...DEFAULT_HEADERS,
      ...authHeaders,
      ...init?.headers,
    };

    // debugLog("GET", parsedUrl.toString());

    return fetch(parsedUrl.toString(), {
      ...init,
      headers,
    });
  }

  protected log(label: string, ...obj: any) {
    debugLog(`${label}(${this.videoId}):`, ...obj);
  }
}
