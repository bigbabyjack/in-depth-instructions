export interface ServiceContext {
  id: string;
  query: string;
}

export interface Payload {
  method: string;
  headers: {
    "Content-Type": string;
  };
  body: string;
}
