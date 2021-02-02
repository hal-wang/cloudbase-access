import Global from "./Global";
import { CollectionReference } from "@cloudbase/database";
import { AppInstance } from "@hal-wang/cloudbase-access";

export default class Collections {
  private static getCollection(collection: string): CollectionReference {
    let name;
    if (Global.isTest) name = `${collection}_test`;
    else name = collection;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (AppInstance.instance.db as any).collection(name);
  }

  static get user(): CollectionReference {
    return Collections.getCollection("cba-user");
  }
  static get todo(): CollectionReference {
    return Collections.getCollection("cba-todo");
  }
}
