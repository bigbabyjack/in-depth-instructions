export interface ServiceContext {
  id: string;
  query: string;
  instructions: string[];
  context?: string;
}

export interface Payload {
  method: string;
  headers: {
    "Content-Type": string;
  };
  body: string;
}


export interface ServiceResponse {
  response: Promise<Response>;
  error?: string;
  buildPayload: (context: ServiceContext) => Payload;
  report?: () => void;
}
