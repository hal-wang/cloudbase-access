import Global from "./Global";
import { AppInstance } from "@hal-wang/cloudbase-access";
import { Database } from "@cloudbase/node-sdk";

export default class Collections {
  private static getCollection(
    collection: string
  ): Database.CollectionReference {
    let name;
    if (Global.isTest) name = `${collection}_test`;
    else name = collection;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return AppInstance.instance.db.collection(name);
  }

  static get user(): Database.CollectionReference {
    return Collections.getCollection("cba-user");
  }
  static get todo(): Database.CollectionReference {
    return Collections.getCollection("cba-todo");
  }
}
