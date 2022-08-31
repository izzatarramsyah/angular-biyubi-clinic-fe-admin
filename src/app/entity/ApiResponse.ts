export class ApiResponse {
    header : HeaderResponse;
    payload : any;
}

export interface HeaderResponse {
    responseCode : string;
    responseMessage : string;
}
  
