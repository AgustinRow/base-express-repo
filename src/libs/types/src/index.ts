export type PartialNull<T> = {
  [P in keyof T]?: T[P] | null;
};

export type Input<T extends (args: any) => any> = T extends (args: infer P) => any ? P : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export type AtLeastOneOf<T extends Object, Keys extends keyof T = keyof T> = Omit<T, Keys> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];
