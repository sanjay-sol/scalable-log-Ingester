export interface Log {
  level: string;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: {
    parentResourceId: string;
  };
}

export type LogGeneric <Data = {status : number}> =  {
  data: Data;
  message: string;
  status: number;
  isPopulated: boolean;
} 
