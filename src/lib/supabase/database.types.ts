
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "audit_log": {
                  Row: {
                    "action": string,"actor": string | null,"at": string,"collection": string | null,"id": number,"record_id": string | null,"tenant_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor"?: string | null,"at"?: string,"collection"?: string | null,"id"?: never,"record_id"?: string | null,"tenant_id"?: string | null
                  }
                  Update: {
                    "action"?: string,"actor"?: string | null,"at"?: string,"collection"?: string | null,"id"?: never,"record_id"?: string | null,"tenant_id"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"collection_access": {
                  Row: {
                    "collection": string,"insert_any": boolean,"owner_field": string | null,"read_scope": Database["public"]['Enums']["access_scope"],"role": Database["public"]['Enums']["app_role"],"write_scope": Database["public"]['Enums']["access_scope"]
                  }
                  ComputedFields: never
                  Insert: {
                    "collection": string,"insert_any"?: boolean,"owner_field"?: string | null,"read_scope"?: Database["public"]['Enums']["access_scope"],"role": Database["public"]['Enums']["app_role"],"write_scope"?: Database["public"]['Enums']["access_scope"]
                  }
                  Update: {
                    "collection"?: string,"insert_any"?: boolean,"owner_field"?: string | null,"read_scope"?: Database["public"]['Enums']["access_scope"],"role"?: Database["public"]['Enums']["app_role"],"write_scope"?: Database["public"]['Enums']["access_scope"]
                  }
                  Relationships: [
                    
                  ]
                },"leads": {
                  Row: {
                    "company": string,"created_at": string,"email": string,"id": string,"name": string,"source": string
                  }
                  ComputedFields: never
                  Insert: {
                    "company": string,"created_at"?: string,"email": string,"id"?: string,"name": string,"source"?: string
                  }
                  Update: {
                    "company"?: string,"created_at"?: string,"email"?: string,"id"?: string,"name"?: string,"source"?: string
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"email": string,"full_name": string,"id": string,"persona_id": string | null,"role": Database["public"]['Enums']["app_role"],"tenant_id": string,"updated_at": string,"worker_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"email": string,"full_name": string,"id": string,"persona_id"?: string | null,"role": Database["public"]['Enums']["app_role"],"tenant_id": string,"updated_at"?: string,"worker_id"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"email"?: string,"full_name"?: string,"id"?: string,"persona_id"?: string | null,"role"?: Database["public"]['Enums']["app_role"],"tenant_id"?: string,"updated_at"?: string,"worker_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "profiles_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"records": {
                  Row: {
                    "collection": string,"data": NonNullable<Json>,"id": string,"ord": number,"owner_worker": string | null,"tenant_id": string,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "collection": string,"data": NonNullable<Json>,"id": string,"ord"?: number,"owner_worker"?: string | null,"tenant_id"?: string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "collection"?: string,"data"?: NonNullable<Json>,"id"?: string,"ord"?: number,"owner_worker"?: string | null,"tenant_id"?: string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "records_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                },"tenants": {
                  Row: {
                    "created_at": string,"id": string,"is_demo": boolean,"name": string,"slug": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"is_demo"?: boolean,"name": string,"slug": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"is_demo"?: boolean,"name"?: string,"slug"?: string
                  }
                  Relationships: [
                    
                  ]
                },"workers": {
                  Row: {
                    "email": string | null,"id": string,"manager_id": string | null,"name": string,"tenant_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "email"?: string | null,"id": string,"manager_id"?: string | null,"name": string,"tenant_id": string
                  }
                  Update: {
                    "email"?: string | null,"id"?: string,"manager_id"?: string | null,"name"?: string,"tenant_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "workers_tenant_id_fkey"
      columns: ["tenant_id"]
isOneToOne: false
      referencedRelation: "tenants"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "custom_access_token_hook":
{ Args: { "event": Json }; Returns: Json
                           }
          }
          Enums: {
            "access_scope": "none"|"own"|"team"|"all","app_role": "employee"|"manager"|"hr_admin"|"finance"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "access_scope": ["none", "own", "team", "all"],"app_role": ["employee", "manager", "hr_admin", "finance"]
          }
        }
} as const
