export enum ChatCategory {
    OPERATIONS = 'operation',
    INVESTISSEMENTS = 'investissement',
    CONSEILS = 'conseil'
  }
  
  export interface ChatMessage {
    role: string;
    content: string;
  }
  
  export interface ChatResponse {
    response: string;
  }
  
  export interface ChatRequest {
    message: string;
    session_id: string;
    category_label: string;
    user_id: string;
  }