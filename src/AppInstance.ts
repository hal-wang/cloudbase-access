import tcb = require("@cloudbase/node-sdk");

export default class AppInstance {
  app: tcb.CloudBase;
  db: tcb.Database.Db;

  private constructor(private readonly config: tcb.ICloudBaseConfig) {
    this.app = tcb.init(this.config);
    this.db = this.app.database();
  }

  public static instance: AppInstance;
  public static init(config: tcb.ICloudBaseConfig): void {
    AppInstance.instance = new AppInstance(config);
  }
}
