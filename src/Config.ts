import { existsSync } from "fs";
import * as path from "path";

interface RouterConfig {
  dir?: string;
  strict?: boolean;
}

interface AppConfig {
  router?: RouterConfig;
}

interface TsStaticItemConfig {
  source: string;
  target: string;
}

interface TsConfig {
  static?: TsStaticItemConfig[];
}

interface DocConfig {
  target: string;
  configPath?: string;
}

export { AppConfig, RouterConfig, TsConfig, TsStaticItemConfig, DocConfig };

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
