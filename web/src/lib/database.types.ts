// Généré depuis le schéma Supabase du projet finlens-prod (mcp generate_typescript_types).
// Ne pas éditer à la main — régénérer après chaque migration.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      analyses: {
        Row: {
          cost_estimate_eur: number | null;
          created_at: string | null;
          document_id: string | null;
          id: string;
          status: string | null;
          summary_json: Json | null;
          tokens_used: number | null;
          workspace_id: string;
        };
        Insert: {
          cost_estimate_eur?: number | null;
          created_at?: string | null;
          document_id?: string | null;
          id?: string;
          status?: string | null;
          summary_json?: Json | null;
          tokens_used?: number | null;
          workspace_id: string;
        };
        Update: {
          cost_estimate_eur?: number | null;
          created_at?: string | null;
          document_id?: string | null;
          id?: string;
          status?: string | null;
          summary_json?: Json | null;
          tokens_used?: number | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "analyses_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "analyses_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_messages: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          role: string;
          sources: Json | null;
          tokens_used: number | null;
          workspace_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          role: string;
          sources?: Json | null;
          tokens_used?: number | null;
          workspace_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          role?: string;
          sources?: Json | null;
          tokens_used?: number | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          error_message: string | null;
          file_name: string;
          file_path: string;
          file_size_bytes: number | null;
          id: string;
          page_count: number | null;
          processing_status: string | null;
          uploaded_at: string | null;
          workspace_id: string;
        };
        Insert: {
          error_message?: string | null;
          file_name: string;
          file_path: string;
          file_size_bytes?: number | null;
          id?: string;
          page_count?: number | null;
          processing_status?: string | null;
          uploaded_at?: string | null;
          workspace_id: string;
        };
        Update: {
          error_message?: string | null;
          file_name?: string;
          file_path?: string;
          file_size_bytes?: number | null;
          id?: string;
          page_count?: number | null;
          processing_status?: string | null;
          uploaded_at?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          company_name: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string;
          plan: string | null;
          role: string | null;
        };
        Insert: {
          company_name?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          plan?: string | null;
          role?: string | null;
        };
        Update: {
          company_name?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          plan?: string | null;
          role?: string | null;
        };
        Relationships: [];
      };
      workspaces: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          status: string | null;
          target_company: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          status?: string | null;
          target_company?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          status?: string | null;
          target_company?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspaces_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
