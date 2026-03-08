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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ai_settings: {
        Row: {
          api_key_encrypted: string
          base_url: string
          created_at: string
          enabled: boolean
          id: string
          max_tokens: number
          model: string
          provider: string
          system_prompt: string
          temperature: number
          updated_at: string
        }
        Insert: {
          api_key_encrypted?: string
          base_url?: string
          created_at?: string
          enabled?: boolean
          id?: string
          max_tokens?: number
          model?: string
          provider?: string
          system_prompt?: string
          temperature?: number
          updated_at?: string
        }
        Update: {
          api_key_encrypted?: string
          base_url?: string
          created_at?: string
          enabled?: boolean
          id?: string
          max_tokens?: number
          model?: string
          provider?: string
          system_prompt?: string
          temperature?: number
          updated_at?: string
        }
        Relationships: []
      }
      ai_usage: {
        Row: {
          created_at: string
          id: string
          messages_count: number
          month_year: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages_count?: number
          month_year?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages_count?: number
          month_year?: string
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon: string
          id: string
          image_url: string
          path: string
          required_plan: string
          slug: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          image_url?: string
          path?: string
          required_plan?: string
          slug: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          image_url?: string
          path?: string
          required_plan?: string
          slug?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      exercises: {
        Row: {
          active: boolean
          category_id: string | null
          contraindications: string
          created_at: string
          description: string
          display_order: number
          id: string
          intensity: string
          name: string
          steps: string[]
          trimester: number[]
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          contraindications?: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          intensity?: string
          name: string
          steps?: string[]
          trimester?: number[]
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string | null
          contraindications?: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          intensity?: string
          name?: string
          steps?: string[]
          trimester?: number[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      health_tips: {
        Row: {
          active: boolean
          category_id: string | null
          created_at: string
          description: string
          display_order: number
          icon: string
          id: string
          image_url: string
          section_title: string
          tips: string[]
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          image_url?: string
          section_title: string
          tips?: string[]
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string | null
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          image_url?: string
          section_title?: string
          tips?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_tips_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          created_at: string
          id: string
          mood: number
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood: number
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: number
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      page_blocks: {
        Row: {
          active: boolean
          block_type: string
          category_id: string | null
          content: Json
          created_at: string
          display_order: number
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          block_type?: string
          category_id?: string | null
          content?: Json
          created_at?: string
          display_order?: number
          id?: string
          title?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          block_type?: string
          category_id?: string | null
          content?: Json
          created_at?: string
          display_order?: number
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_blocks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean
          badge: string
          button_text: string
          checkout_url: string
          created_at: string
          description: string
          display_order: number
          excluded_features: string[]
          features: string[]
          highlight_text: string
          highlighted: boolean
          icon: string
          id: string
          name: string
          price: string
          price_label: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          badge?: string
          button_text?: string
          checkout_url?: string
          created_at?: string
          description?: string
          display_order?: number
          excluded_features?: string[]
          features?: string[]
          highlight_text?: string
          highlighted?: boolean
          icon?: string
          id?: string
          name: string
          price?: string
          price_label?: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          badge?: string
          button_text?: string
          checkout_url?: string
          created_at?: string
          description?: string
          display_order?: number
          excluded_features?: string[]
          features?: string[]
          highlight_text?: string
          highlighted?: boolean
          icon?: string
          id?: string
          name?: string
          price?: string
          price_label?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      pregnancy_profiles: {
        Row: {
          age: number
          created_at: string
          current_symptoms: string[]
          doctor_name: string
          doctor_phone: string
          due_date: string
          emotional_level: number
          first_pregnancy: boolean
          focus: string
          has_medical_care: boolean
          id: string
          last_period_date: string | null
          name: string
          phone: string
          updated_at: string
          user_id: string
          working: boolean
        }
        Insert: {
          age?: number
          created_at?: string
          current_symptoms?: string[]
          doctor_name?: string
          doctor_phone?: string
          due_date: string
          emotional_level?: number
          first_pregnancy?: boolean
          focus?: string
          has_medical_care?: boolean
          id?: string
          last_period_date?: string | null
          name?: string
          phone?: string
          updated_at?: string
          user_id: string
          working?: boolean
        }
        Update: {
          age?: number
          created_at?: string
          current_symptoms?: string[]
          doctor_name?: string
          doctor_phone?: string
          due_date?: string
          emotional_level?: number
          first_pregnancy?: boolean
          focus?: string
          has_medical_care?: boolean
          id?: string
          last_period_date?: string | null
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string
          working?: boolean
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean
          button_text: string
          created_at: string
          description: string
          display_order: number
          ends_at: string | null
          id: string
          image_url: string
          link_url: string
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          button_text?: string
          created_at?: string
          description?: string
          display_order?: number
          ends_at?: string | null
          id?: string
          image_url?: string
          link_url?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          button_text?: string
          created_at?: string
          description?: string
          display_order?: number
          ends_at?: string | null
          id?: string
          image_url?: string
          link_url?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      push_notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          title: string
          url: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          url?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          device_info: string
          fcm_token: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: string
          fcm_token: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: string
          fcm_token?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          reminder_date: string
          reminder_time: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          reminder_date: string
          reminder_time?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          reminder_date?: string
          reminder_time?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_conversations: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          created_at: string
          id: string
          rating: number | null
          rating_text: string | null
          status: string
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          rating_text?: string | null
          status?: string
          user_id: string
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          rating_text?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          image_url: string | null
          message: string
          read: boolean
          sender: string
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          message: string
          read?: boolean
          sender?: string
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          message?: string
          read?: boolean
          sender?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "support_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      symptoms: {
        Row: {
          active: boolean
          alert_level: string
          category_id: string | null
          created_at: string
          description: string
          display_order: number
          id: string
          name: string
          trimester: number[]
          updated_at: string
          what_to_do: string
          when_common: string
          when_see_doctor: string
        }
        Insert: {
          active?: boolean
          alert_level?: string
          category_id?: string | null
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          name: string
          trimester?: number[]
          updated_at?: string
          what_to_do?: string
          when_common?: string
          when_see_doctor?: string
        }
        Update: {
          active?: boolean
          alert_level?: string
          category_id?: string | null
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          name?: string
          trimester?: number[]
          updated_at?: string
          what_to_do?: string
          when_common?: string
          when_see_doctor?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptoms_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          account_status: string
          created_at: string
          email: string
          expires_at: string | null
          id: string
          kiwify_order_id: string | null
          plan: Database["public"]["Enums"]["user_plan"]
          plan_status: Database["public"]["Enums"]["plan_status"]
          purchased_at: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_status?: string
          created_at?: string
          email?: string
          expires_at?: string | null
          id?: string
          kiwify_order_id?: string | null
          plan?: Database["public"]["Enums"]["user_plan"]
          plan_status?: Database["public"]["Enums"]["plan_status"]
          purchased_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_status?: string
          created_at?: string
          email?: string
          expires_at?: string | null
          id?: string
          kiwify_order_id?: string | null
          plan?: Database["public"]["Enums"]["user_plan"]
          plan_status?: Database["public"]["Enums"]["plan_status"]
          purchased_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
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
      webhook_logs: {
        Row: {
          data_evento: string
          email: string
          evento: string
          id: string
          plano_aplicado: string
          produto: string
          status_processamento: string
        }
        Insert: {
          data_evento?: string
          email?: string
          evento?: string
          id?: string
          plano_aplicado?: string
          produto?: string
          status_processamento?: string
        }
        Update: {
          data_evento?: string
          email?: string
          evento?: string
          id?: string
          plano_aplicado?: string
          produto?: string
          status_processamento?: string
        }
        Relationships: []
      }
      week_contents: {
        Row: {
          active: boolean
          alerts: string[]
          baby_development: string
          baby_size: string
          baby_size_comparison: string
          category_id: string | null
          common_symptoms: string[]
          created_at: string
          id: string
          mother_changes: string
          reviewed: boolean
          status: string
          tip: string
          updated_at: string
          week_number: number
        }
        Insert: {
          active?: boolean
          alerts?: string[]
          baby_development?: string
          baby_size?: string
          baby_size_comparison?: string
          category_id?: string | null
          common_symptoms?: string[]
          created_at?: string
          id?: string
          mother_changes?: string
          reviewed?: boolean
          status?: string
          tip?: string
          updated_at?: string
          week_number: number
        }
        Update: {
          active?: boolean
          alerts?: string[]
          baby_development?: string
          baby_size?: string
          baby_size_comparison?: string
          category_id?: string | null
          common_symptoms?: string[]
          created_at?: string
          id?: string
          mother_changes?: string
          reviewed?: boolean
          status?: string
          tip?: string
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "week_contents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_tips: {
        Row: {
          active: boolean
          category_id: string | null
          content: string
          created_at: string
          day_of_week: number
          display_order: number
          id: string
          title: string
          updated_at: string
          week_number: number
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          content?: string
          created_at?: string
          day_of_week?: number
          display_order?: number
          id?: string
          title: string
          updated_at?: string
          week_number: number
        }
        Update: {
          active?: boolean
          category_id?: string | null
          content?: string
          created_at?: string
          day_of_week?: number
          display_order?: number
          id?: string
          title?: string
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_tips_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_user_profile: {
        Args: { _email?: string }
        Returns: {
          account_status: string
          created_at: string
          email: string
          expires_at: string | null
          id: string
          kiwify_order_id: string | null
          plan: Database["public"]["Enums"]["user_plan"]
          plan_status: Database["public"]["Enums"]["plan_status"]
          purchased_at: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      plan_status: "none" | "active" | "expired"
      user_plan: "none" | "essential" | "premium"
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
      app_role: ["admin", "moderator", "user"],
      plan_status: ["none", "active", "expired"],
      user_plan: ["none", "essential", "premium"],
    },
  },
} as const
