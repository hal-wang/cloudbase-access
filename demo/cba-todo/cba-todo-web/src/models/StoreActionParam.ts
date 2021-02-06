declare class StoreActionParam {
  commit: (mutation: string, val?: unknown) => void;
  state: Record<string, unknown>;
  dispatch: (path: string, val?: unknown) => unknown;
}

export default StoreActionParam;
