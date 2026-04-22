export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          comment: string | null;
          company: string | null;
          created_at: string;
          email: string;
          id: number;
          linked_response_id: number | null;
          name: string;
        };
        Insert: {
          comment?: string | null;
          company?: string | null;
          created_at?: string;
          email: string;
          id?: number;
          linked_response_id?: number | null;
          name: string;
        };
        Update: {
          comment?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string;
          id?: number;
          linked_response_id?: number | null;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contacts_linked_response_id_fkey";
            columns: ["linked_response_id"];
            isOneToOne: false;
            referencedRelation: "responses";
            referencedColumns: ["id"];
          }
        ];
      };
      responses: {
        Row: {
          created_at: string;
          id: number;
          ip_address: string;
          response: "Yes" | "Maybe" | "No";
          user_agent: string;
          visitor_hash: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          ip_address: string;
          response: "Yes" | "Maybe" | "No";
          user_agent: string;
          visitor_hash: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          ip_address?: string;
          response?: "Yes" | "Maybe" | "No";
          user_agent?: string;
          visitor_hash?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
