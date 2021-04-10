import { AppInstance } from "@hal-wang/cloudbase-access";
import { Database } from "@cloudbase/node-sdk";
import { isTest } from "../Global";

export default class Collections {
  private static getCollection(
    collection: string
  ): Database.CollectionReference {
    let name;
    if (isTest) name = `${collection}_test`;
    else name = collection;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return AppInstance.instance.db.collection(name);
  }

  static get url(): Database.CollectionReference {
    return Collections.getCollection("short-url");
  }
}
