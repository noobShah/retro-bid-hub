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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      auctions: {
        Row: {
          base_price: number
          bidders_count: number | null
          category: Database["public"]["Enums"]["auction_category"]
          city: string
          condition_rating: number | null
          cooldown_hours: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          expiration_date: string
          id: string
          images: string[] | null
          insurance_status: boolean | null
          status: Database["public"]["Enums"]["auction_status"] | null
          title: string
          years_used: number | null
        }
        Insert: {
          base_price: number
          bidders_count?: number | null
          category: Database["public"]["Enums"]["auction_category"]
          city: string
          condition_rating?: number | null
          cooldown_hours?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expiration_date: string
          id?: string
          images?: string[] | null
          insurance_status?: boolean | null
          status?: Database["public"]["Enums"]["auction_status"] | null
          title: string
          years_used?: number | null
        }
        Update: {
          base_price?: number
          bidders_count?: number | null
          category?: Database["public"]["Enums"]["auction_category"]
          city?: string
          condition_rating?: number | null
          cooldown_hours?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expiration_date?: string
          id?: string
          images?: string[] | null
          insurance_status?: boolean | null
          status?: Database["public"]["Enums"]["auction_status"] | null
          title?: string
          years_used?: number | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          auction_id: string | null
          content: string | null
          email_type: Database["public"]["Enums"]["email_type"]
          id: string
          sent_at: string | null
          user_id: string | null
        }
        Insert: {
          auction_id?: string | null
          content?: string | null
          email_type: Database["public"]["Enums"]["email_type"]
          id?: string
          sent_at?: string | null
          user_id?: string | null
        }
        Update: {
          auction_id?: string | null
          content?: string | null
          email_type?: Database["public"]["Enums"]["email_type"]
          id?: string
          sent_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      participations: {
        Row: {
          auction_id: string
          deposit_fee: number
          id: string
          joined_at: string | null
          platform_fee: number
          status: Database["public"]["Enums"]["participation_status"] | null
          user_id: string
        }
        Insert: {
          auction_id: string
          deposit_fee: number
          id?: string
          joined_at?: string | null
          platform_fee: number
          status?: Database["public"]["Enums"]["participation_status"] | null
          user_id: string
        }
        Update: {
          auction_id?: string
          deposit_fee?: number
          id?: string
          joined_at?: string | null
          platform_fee?: number
          status?: Database["public"]["Enums"]["participation_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participations_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string
          created_at: string | null
          email: string
          full_name: string
          id: string
        }
        Insert: {
          city: string
          created_at?: string | null
          email: string
          full_name: string
          id: string
        }
        Update: {
          city?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      auction_category:
        | "Two Wheeler"
        | "Four Wheeler"
        | "Heavy Vehicle"
        | "Property"
        | "Antiques"
      auction_status: "active" | "cooldown" | "expired"
      email_type: "participation" | "refund" | "winner"
      participation_status: "active" | "won" | "lost" | "exited"
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
      app_role: ["admin", "user"],
      auction_category: [
        "Two Wheeler",
        "Four Wheeler",
        "Heavy Vehicle",
        "Property",
        "Antiques",
      ],
      auction_status: ["active", "cooldown", "expired"],
      email_type: ["participation", "refund", "winner"],
      participation_status: ["active", "won", "lost", "exited"],
    },
  },
} as const
