export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ajouts_copilote: {
        Row: {
          categorie: string
          contenu: string
          created_at: string
          created_by: string | null
          dossier_id: string
          id: string
          organization_id: string
          profil_cible: Database["public"]["Enums"]["profil_analyse"] | null
          sources: Json
        }
        Insert: {
          categorie: string
          contenu: string
          created_at?: string
          created_by?: string | null
          dossier_id: string
          id?: string
          organization_id: string
          profil_cible?: Database["public"]["Enums"]["profil_analyse"] | null
          sources?: Json
        }
        Update: {
          categorie?: string
          contenu?: string
          created_at?: string
          created_by?: string | null
          dossier_id?: string
          id?: string
          organization_id?: string
          profil_cible?: Database["public"]["Enums"]["profil_analyse"] | null
          sources?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ajouts_copilote_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ajouts_copilote_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          complexity_label: string | null
          content: string
          created_at: string
          dossier_id: string
          id: string
          model: Database["public"]["Enums"]["ia_model"] | null
          organization_id: string
          role: Database["public"]["Enums"]["chat_role"]
          sources: Json
          tokens_in: number | null
          tokens_out: number | null
          user_id: string | null
        }
        Insert: {
          complexity_label?: string | null
          content: string
          created_at?: string
          dossier_id: string
          id?: string
          model?: Database["public"]["Enums"]["ia_model"] | null
          organization_id: string
          role: Database["public"]["Enums"]["chat_role"]
          sources?: Json
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string | null
        }
        Update: {
          complexity_label?: string | null
          content?: string
          created_at?: string
          dossier_id?: string
          id?: string
          model?: Database["public"]["Enums"]["ia_model"] | null
          organization_id?: string
          role?: Database["public"]["Enums"]["chat_role"]
          sources?: Json
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          auto_checked: boolean
          created_at: string
          dossier_id: string
          id: string
          label: string
          linked_contradiction_id: string | null
          linked_document_missing: string | null
          organization_id: string
          requires_manual_check: boolean
        }
        Insert: {
          auto_checked?: boolean
          created_at?: string
          dossier_id: string
          id?: string
          label: string
          linked_contradiction_id?: string | null
          linked_document_missing?: string | null
          organization_id: string
          requires_manual_check?: boolean
        }
        Update: {
          auto_checked?: boolean
          created_at?: string
          dossier_id?: string
          id?: string
          label?: string
          linked_contradiction_id?: string | null
          linked_document_missing?: string | null
          organization_id?: string
          requires_manual_check?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_items_linked_contradiction_id_fkey"
            columns: ["linked_contradiction_id"]
            isOneToOne: false
            referencedRelation: "contradictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      comparisons: {
        Row: {
          contenu_json: Json
          created_at: string
          created_by: string | null
          dossier_ids: string[]
          id: string
          model: Database["public"]["Enums"]["ia_model"]
          organization_id: string
          tokens_in: number | null
          tokens_out: number | null
        }
        Insert: {
          contenu_json: Json
          created_at?: string
          created_by?: string | null
          dossier_ids: string[]
          id?: string
          model?: Database["public"]["Enums"]["ia_model"]
          organization_id: string
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Update: {
          contenu_json?: Json
          created_at?: string
          created_by?: string | null
          dossier_ids?: string[]
          id?: string
          model?: Database["public"]["Enums"]["ia_model"]
          organization_id?: string
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comparisons_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_cost_tracking: {
        Row: {
          created_at: string
          cycle_end: string
          cycle_start: string
          id: string
          invoiced_amount_eur: number
          organization_id: string
          ratio: number | null
          real_cost_usd: number
          renegotiation_flagged: boolean
        }
        Insert: {
          created_at?: string
          cycle_end: string
          cycle_start: string
          id?: string
          invoiced_amount_eur: number
          organization_id: string
          ratio?: number | null
          real_cost_usd?: number
          renegotiation_flagged?: boolean
        }
        Update: {
          created_at?: string
          cycle_end?: string
          cycle_start?: string
          id?: string
          invoiced_amount_eur?: number
          organization_id?: string
          ratio?: number | null
          real_cost_usd?: number
          renegotiation_flagged?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "contract_cost_tracking_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contradictions: {
        Row: {
          arbitre_at: string | null
          arbitre_par: string | null
          created_at: string
          description: string
          dossier_id: string
          gravite: Database["public"]["Enums"]["gravite"]
          id: string
          organization_id: string
          source_a: Json
          source_b: Json
          status: Database["public"]["Enums"]["contradiction_status"]
        }
        Insert: {
          arbitre_at?: string | null
          arbitre_par?: string | null
          created_at?: string
          description: string
          dossier_id: string
          gravite: Database["public"]["Enums"]["gravite"]
          id?: string
          organization_id: string
          source_a: Json
          source_b: Json
          status?: Database["public"]["Enums"]["contradiction_status"]
        }
        Update: {
          arbitre_at?: string | null
          arbitre_par?: string | null
          created_at?: string
          description?: string
          dossier_id?: string
          gravite?: Database["public"]["Enums"]["gravite"]
          id?: string
          organization_id?: string
          source_a?: Json
          source_b?: Json
          status?: Database["public"]["Enums"]["contradiction_status"]
        }
        Relationships: [
          {
            foreignKeyName: "contradictions_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contradictions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          document_id: string
          dossier_id: string
          embedding: string | null
          id: string
          organization_id: string
          owner_id: string | null
          page_number: number | null
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          document_id: string
          dossier_id: string
          embedding?: string | null
          id?: string
          organization_id: string
          owner_id?: string | null
          page_number?: number | null
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          document_id?: string
          dossier_id?: string
          embedding?: string | null
          id?: string
          organization_id?: string
          owner_id?: string | null
          page_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_chunks_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_chunks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content_hash: string | null
          created_at: string
          dossier_id: string
          error_message: string | null
          id: string
          is_duplicate_of: string | null
          mime_type: string | null
          organization_id: string
          original_name: string
          page_count: number | null
          status: Database["public"]["Enums"]["document_status"]
          storage_path: string
          type_document: string | null
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          dossier_id: string
          error_message?: string | null
          id?: string
          is_duplicate_of?: string | null
          mime_type?: string | null
          organization_id: string
          original_name: string
          page_count?: number | null
          status?: Database["public"]["Enums"]["document_status"]
          storage_path: string
          type_document?: string | null
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          dossier_id?: string
          error_message?: string | null
          id?: string
          is_duplicate_of?: string | null
          mime_type?: string | null
          organization_id?: string
          original_name?: string
          page_count?: number | null
          status?: Database["public"]["Enums"]["document_status"]
          storage_path?: string
          type_document?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_is_duplicate_of_fkey"
            columns: ["is_duplicate_of"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      dossiers: {
        Row: {
          active_profil: Database["public"]["Enums"]["profil_analyse"]
          created_at: string
          id: string
          name: string
          organization_id: string
          owner_id: string | null
          personnalise_indicateurs: string[]
          purge_at: string | null
          risk_score: number | null
          status: Database["public"]["Enums"]["dossier_status"]
          trashed_at: string | null
          type_operation: Database["public"]["Enums"]["type_operation"]
          updated_at: string
        }
        Insert: {
          active_profil?: Database["public"]["Enums"]["profil_analyse"]
          created_at?: string
          id?: string
          name: string
          organization_id: string
          owner_id?: string | null
          personnalise_indicateurs?: string[]
          purge_at?: string | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["dossier_status"]
          trashed_at?: string | null
          type_operation?: Database["public"]["Enums"]["type_operation"]
          updated_at?: string
        }
        Update: {
          active_profil?: Database["public"]["Enums"]["profil_analyse"]
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          owner_id?: string | null
          personnalise_indicateurs?: string[]
          purge_at?: string | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["dossier_status"]
          trashed_at?: string | null
          type_operation?: Database["public"]["Enums"]["type_operation"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossiers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      erasure_requests: {
        Row: {
          executed_at: string | null
          id: string
          organization_id: string
          perimeter_summary: string | null
          requested_at: string
          requested_by: string | null
          scope: string
        }
        Insert: {
          executed_at?: string | null
          id?: string
          organization_id: string
          perimeter_summary?: string | null
          requested_at?: string
          requested_by?: string | null
          scope: string
        }
        Update: {
          executed_at?: string | null
          id?: string
          organization_id?: string
          perimeter_summary?: string | null
          requested_at?: string
          requested_by?: string | null
          scope?: string
        }
        Relationships: [
          {
            foreignKeyName: "erasure_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      exports: {
        Row: {
          created_at: string
          created_by: string | null
          dossier_id: string
          format: string
          id: string
          organization_id: string
          profil: Database["public"]["Enums"]["profil_analyse"]
          storage_path: string | null
          template: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dossier_id: string
          format: string
          id?: string
          organization_id: string
          profil: Database["public"]["Enums"]["profil_analyse"]
          storage_path?: string | null
          template?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dossier_id?: string
          format?: string
          id?: string
          organization_id?: string
          profil?: Database["public"]["Enums"]["profil_analyse"]
          storage_path?: string | null
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "exports_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      extractions: {
        Row: {
          contenu_json: Json
          created_at: string
          dossier_id: string
          id: string
          model: Database["public"]["Enums"]["ia_model"]
          organization_id: string
          sources: Json
          tokens_in: number | null
          tokens_out: number | null
        }
        Insert: {
          contenu_json: Json
          created_at?: string
          dossier_id: string
          id?: string
          model?: Database["public"]["Enums"]["ia_model"]
          organization_id: string
          sources?: Json
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Update: {
          contenu_json?: Json
          created_at?: string
          dossier_id?: string
          id?: string
          model?: Database["public"]["Enums"]["ia_model"]
          organization_id?: string
          sources?: Json
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "extractions_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: true
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extractions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notes_profils: {
        Row: {
          contenu_json: Json
          dossier_id: string
          generated_at: string
          id: string
          model: Database["public"]["Enums"]["ia_model"]
          organization_id: string
          profil: Database["public"]["Enums"]["profil_analyse"]
          risk_score: number | null
          tokens_in: number | null
          tokens_out: number | null
        }
        Insert: {
          contenu_json: Json
          dossier_id: string
          generated_at?: string
          id?: string
          model?: Database["public"]["Enums"]["ia_model"]
          organization_id: string
          profil: Database["public"]["Enums"]["profil_analyse"]
          risk_score?: number | null
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Update: {
          contenu_json?: Json
          dossier_id?: string
          generated_at?: string
          id?: string
          model?: Database["public"]["Enums"]["ia_model"]
          organization_id?: string
          profil?: Database["public"]["Enums"]["profil_analyse"]
          risk_score?: number | null
          tokens_in?: number | null
          tokens_out?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_profils_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_profils_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          data_residency: string
          id: string
          name: string
          offre: Database["public"]["Enums"]["offre"]
          seats_included: number
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_residency?: string
          id?: string
          name: string
          offre?: Database["public"]["Enums"]["offre"]
          seats_included?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_residency?: string
          id?: string
          name?: string
          offre?: Database["public"]["Enums"]["offre"]
          seats_included?: number
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotas_essentiel: {
        Row: {
          blocked: boolean
          created_at: string
          cycle_end: string
          cycle_start: string
          dossiers_analyses_count: number
          dossiers_analyses_limit: number
          id: string
          organization_id: string
          questions_count: number
          questions_limit: number
        }
        Insert: {
          blocked?: boolean
          created_at?: string
          cycle_end: string
          cycle_start: string
          dossiers_analyses_count?: number
          dossiers_analyses_limit?: number
          id?: string
          organization_id: string
          questions_count?: number
          questions_limit?: number
        }
        Update: {
          blocked?: boolean
          created_at?: string
          cycle_end?: string
          cycle_start?: string
          dossiers_analyses_count?: number
          dossiers_analyses_limit?: number
          id?: string
          organization_id?: string
          questions_count?: number
          questions_limit?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotas_essentiel_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          cache_read_tokens: number
          cache_write_tokens: number
          cost_usd: number
          created_at: string
          dossier_id: string | null
          id: string
          model: Database["public"]["Enums"]["ia_model"]
          organization_id: string
          task_type: Database["public"]["Enums"]["task_type"]
          tokens_in: number
          tokens_out: number
          user_id: string | null
        }
        Insert: {
          cache_read_tokens?: number
          cache_write_tokens?: number
          cost_usd?: number
          created_at?: string
          dossier_id?: string | null
          id?: string
          model: Database["public"]["Enums"]["ia_model"]
          organization_id: string
          task_type: Database["public"]["Enums"]["task_type"]
          tokens_in?: number
          tokens_out?: number
          user_id?: string | null
        }
        Update: {
          cache_read_tokens?: number
          cache_write_tokens?: number
          cost_usd?: number
          created_at?: string
          dossier_id?: string | null
          id?: string
          model?: Database["public"]["Enums"]["ia_model"]
          organization_id?: string
          task_type?: Database["public"]["Enums"]["task_type"]
          tokens_in?: number
          tokens_out?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      velocity_alerts: {
        Row: {
          baseline_value: number
          created_at: string
          id: string
          metric: string
          observed_value: number
          organization_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["velocity_alert_status"]
          user_id: string | null
        }
        Insert: {
          baseline_value: number
          created_at?: string
          id?: string
          metric: string
          observed_value: number
          organization_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["velocity_alert_status"]
          user_id?: string | null
        }
        Update: {
          baseline_value?: number
          created_at?: string
          id?: string
          metric?: string
          observed_value?: number
          organization_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["velocity_alert_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "velocity_alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_org_role: { Args: { org_id: string }; Returns: string }
      detect_velocity_anomalies: {
        Args: never
        Returns: {
          baseline_value: number
          is_burst: boolean
          metric: string
          observed_value: number
          organization_id: string
          user_id: string
        }[]
      }
      is_org_member: { Args: { org_id: string }; Returns: boolean }
      match_document_chunks: {
        Args: {
          p_dossier_id: string
          p_match_count?: number
          p_query_embedding: string
        }
        Returns: {
          content: string
          document_id: string
          id: string
          page_number: number
          similarity: number
        }[]
      }
    }
    Enums: {
      chat_role: "user" | "assistant"
      contradiction_status: "ouverte" | "arbitree"
      document_status: "en_attente" | "en_cours" | "indexe" | "erreur"
      dossier_status: "actif" | "archive" | "corbeille"
      gravite: "critique" | "a_verifier" | "mineur"
      ia_model:
        | "fable_5"
        | "sonnet_5"
        | "haiku_4_5"
        | "opus_4_8"
        | "gemini_flash"
        | "gemini_flash_lite"
      offre: "essentiel" | "analyste" | "fonds"
      profil_analyse:
        | "pe_vc"
        | "ma"
        | "family_office"
        | "cfo"
        | "audit_conseil"
        | "generaliste"
        | "personnalise"
      task_type:
        | "extraction"
        | "reformulation_profil"
        | "chat"
        | "comparaison"
        | "classement_copilote"
        | "classification_complexite"
        | "nettoyage_pdf"
      type_operation:
        | "due_diligence"
        | "lbo"
        | "serie_a_b"
        | "screening"
        | "veille"
      velocity_alert_status:
        | "ouverte"
        | "revue_ok"
        | "revue_suspecte"
        | "throttled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      chat_role: ["user", "assistant"],
      contradiction_status: ["ouverte", "arbitree"],
      document_status: ["en_attente", "en_cours", "indexe", "erreur"],
      dossier_status: ["actif", "archive", "corbeille"],
      gravite: ["critique", "a_verifier", "mineur"],
      ia_model: [
        "fable_5",
        "sonnet_5",
        "haiku_4_5",
        "opus_4_8",
        "gemini_flash",
        "gemini_flash_lite",
      ],
      offre: ["essentiel", "analyste", "fonds"],
      profil_analyse: [
        "pe_vc",
        "ma",
        "family_office",
        "cfo",
        "audit_conseil",
        "generaliste",
        "personnalise",
      ],
      task_type: [
        "extraction",
        "reformulation_profil",
        "chat",
        "comparaison",
        "classement_copilote",
        "classification_complexite",
        "nettoyage_pdf",
      ],
      type_operation: [
        "due_diligence",
        "lbo",
        "serie_a_b",
        "screening",
        "veille",
      ],
      velocity_alert_status: [
        "ouverte",
        "revue_ok",
        "revue_suspecte",
        "throttled",
      ],
    },
  },
} as const
