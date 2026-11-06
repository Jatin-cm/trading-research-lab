/**
 * Database definitions matching Supabase PostgreSQL schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      trading_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          authorized_markets: Json
          trading_sessions: Json
          daily_loss_limit: number
          weekly_loss_limit: number
          risk_per_trade: number
          max_trades_per_day: number
          timeframe_hierarchy: Json
          entry_rules: Json
          exit_rules: Json
          psychology_rules: Json
          no_trade_conditions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          authorized_markets?: Json
          trading_sessions?: Json
          daily_loss_limit?: number
          weekly_loss_limit?: number
          risk_per_trade?: number
          max_trades_per_day?: number
          timeframe_hierarchy?: Json
          entry_rules?: Json
          exit_rules?: Json
          psychology_rules?: Json
          no_trade_conditions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          authorized_markets?: Json
          trading_sessions?: Json
          daily_loss_limit?: number
          weekly_loss_limit?: number
          risk_per_trade?: number
          max_trades_per_day?: number
          timeframe_hierarchy?: Json
          entry_rules?: Json
          exit_rules?: Json
          psychology_rules?: Json
          no_trade_conditions?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      strategies: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          market: string
          symbol: string | null
          timeframe: string
          status: 'ACTIVE' | 'TESTING' | 'ARCHIVED' | 'TEMPLATE' | 'LIVE'
          current_version: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          market: string
          symbol?: string | null
          timeframe: string
          status?: 'ACTIVE' | 'TESTING' | 'ARCHIVED' | 'TEMPLATE' | 'LIVE'
          current_version?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          market?: string
          symbol?: string | null
          timeframe?: string
          status?: 'ACTIVE' | 'TESTING' | 'ARCHIVED' | 'TEMPLATE' | 'LIVE'
          current_version?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      strategy_versions: {
        Row: {
          id: string
          strategy_id: string
          user_id: string
          version: string
          rules: Json
          parameters: Json
          created_at: string
        }
        Insert: {
          id?: string
          strategy_id: string
          user_id: string
          version: string
          rules?: Json
          parameters?: Json
          created_at?: string
        }
        Update: {
          id?: string
          strategy_id?: string
          user_id?: string
          version?: string
          rules?: Json
          parameters?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_versions_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          trade_date: string
          symbol: string
          direction: 'LONG' | 'SHORT'
          strategy_id: string | null
          entry_price: number
          stop_loss: number
          take_profit: number
          exit_price: number | null
          result: 'WIN' | 'LOSS' | 'BREAKEVEN' | 'PENDING' | null
          r_multiple: number | null
          pnl: number | null
          emotion: string | null
          mistake: string | null
          notes: string | null
          screenshot_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trade_date?: string
          symbol: string
          direction: 'LONG' | 'SHORT'
          strategy_id?: string | null
          entry_price: number
          stop_loss: number
          take_profit: number
          exit_price?: number | null
          result?: 'WIN' | 'LOSS' | 'BREAKEVEN' | 'PENDING' | null
          r_multiple?: number | null
          pnl?: number | null
          emotion?: string | null
          mistake?: string | null
          notes?: string | null
          screenshot_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trade_date?: string
          symbol?: string
          direction?: 'LONG' | 'SHORT'
          strategy_id?: string | null
          entry_price?: number
          stop_loss?: number
          take_profit?: number
          exit_price?: number | null
          result?: 'WIN' | 'LOSS' | 'BREAKEVEN' | 'PENDING' | null
          r_multiple?: number | null
          pnl?: number | null
          emotion?: string | null
          mistake?: string | null
          notes?: string | null
          screenshot_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          }
        ]
      }
      trades: {
        Row: {
          id: string
          user_id: string
          strategy_id: string | null
          symbol: string
          direction: 'LONG' | 'SHORT'
          entry_price: number
          exit_price: number | null
          stop_loss: number
          take_profit: number
          quantity: number
          risk_amount: number
          r_multiple: number | null
          pnl: number | null
          status: 'OPEN' | 'CLOSED' | 'CANCELLED' | 'PENDING'
          entry_time: string
          exit_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          strategy_id?: string | null
          symbol: string
          direction: 'LONG' | 'SHORT'
          entry_price: number
          exit_price?: number | null
          stop_loss: number
          take_profit: number
          quantity: number
          risk_amount?: number
          r_multiple?: number | null
          pnl?: number | null
          status?: 'OPEN' | 'CLOSED' | 'CANCELLED' | 'PENDING'
          entry_time?: string
          exit_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          strategy_id?: string | null
          symbol?: string
          direction?: 'LONG' | 'SHORT'
          entry_price?: number
          exit_price?: number | null
          stop_loss?: number
          take_profit?: number
          quantity?: number
          risk_amount?: number
          r_multiple?: number | null
          pnl?: number | null
          status?: 'OPEN' | 'CLOSED' | 'CANCELLED' | 'PENDING'
          entry_time?: string
          exit_time?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
