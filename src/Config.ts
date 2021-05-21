import { existsSync } from "fs";
import * as path from "path";
import ApiDocsConfig from "./ApiDocs/ApiDocsConfig";

export interface AppConfig {
  router?: RouterConfig;
  ts?: TsConfig;
  doc?: ApiDocsConfig;
}

export interface RouterConfig {
  dir?: string;
  strict?: boolean;
}

export interface TsStaticItemConfig {
  source: string;
  target: string;
}

export interface TsConfig {
  static?: TsStaticItemConfig[];
}

export default class Config {
  private static config: AppConfig | null | undefined = undefined;
  public static get instance(): AppConfig | null {
    if (this.config == undefined) {
      const configPath = path.join(process.cwd(), "cba.config.json");
      if (!existsSync(configPath)) {
        this.config = null;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.config = require(configPath) as AppConfig;
      }
    }
    return this.config;
  }
}
