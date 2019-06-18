export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: {}, info: any) => any;
  };
}

export interface UserInput {
  email: string;
  password: string;
}
