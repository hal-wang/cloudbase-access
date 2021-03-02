import ApiDocs from ".";
import Action from "../Action";

export default class ApiDocsNoteParser {
  constructor(private readonly file: string, private readonly action: Action) {}

  public get docs(): ApiDocs | undefined {
    return;
  }
}
