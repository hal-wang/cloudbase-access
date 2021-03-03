export default interface ApiDocsNoteParserStruct {
  title: string;
  value: string;
  children?: ApiDocsNoteParserStruct[] | null;
}
