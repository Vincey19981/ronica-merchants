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
      assets: {
        Row: {
          asset_tag: string
          assigned_to: string | null
          created_at: string
          id: string
          location: string | null
          manufacturer: string | null
          model: string | null
          org_id: string
          serial: string | null
          status: string
          type: string | null
          updated_at: string
          warranty_end: string | null
        }
        Insert: {
          asset_tag: string
          assigned_to?: string | null
          created_at?: string
          id?: string
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          org_id: string
          serial?: string | null
          status?: string
          type?: string | null
          updated_at?: string
          warranty_end?: string | null
        }
        Update: {
          asset_tag?: string
          assigned_to?: string | null
          created_at?: string
          id?: string
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          org_id?: string
          serial?: string | null
          status?: string
          type?: string | null
          updated_at?: string
          warranty_end?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          after: Json | null
          before: Json | null
          created_at: string
          id: string
          ip: string | null
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          ip?: string | null
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          ip?: string | null
          resource_id?: string | null
          resource_type?: string
        }
        Relationships: []
      }
      compliance_documents: {
        Row: {
          created_at: string
          doc_type: string
          expires_at: string | null
          id: string
          issued_at: string | null
          notes: string | null
          org_id: string | null
          status: string
          storage_path: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          notes?: string | null
          org_id?: string | null
          status?: string
          storage_path: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          notes?: string | null
          org_id?: string | null
          status?: string
          storage_path?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_pricing: {
        Row: {
          contract_id: string
          created_at: string
          id: string
          max_qty: number | null
          min_qty: number
          product_id: string
          unit_price_cents: number
        }
        Insert: {
          contract_id: string
          created_at?: string
          id?: string
          max_qty?: number | null
          min_qty?: number
          product_id: string
          unit_price_cents: number
        }
        Update: {
          contract_id?: string
          created_at?: string
          id?: string
          max_qty?: number | null
          min_qty?: number
          product_id?: string
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_pricing_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_pricing_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          created_at: string
          end_date: string
          framework: string | null
          id: string
          notes: string | null
          org_id: string
          reference: string
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          framework?: string | null
          id?: string
          notes?: string | null
          org_id: string
          reference: string
          start_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          framework?: string | null
          id?: string
          notes?: string | null
          org_id?: string
          reference?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          attachment_path: string | null
          created_at: string
          email: string
          enquiry_type: string
          id: string
          name: string
          organization: string
          phone: string
          products_needed: string
          source: string | null
        }
        Insert: {
          attachment_path?: string | null
          created_at?: string
          email: string
          enquiry_type: string
          id?: string
          name: string
          organization: string
          phone: string
          products_needed: string
          source?: string | null
        }
        Update: {
          attachment_path?: string | null
          created_at?: string
          email?: string
          enquiry_type?: string
          id?: string
          name?: string
          organization?: string
          phone?: string
          products_needed?: string
          source?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          description: string
          id: string
          invoice_id: string
          line_total_cents: number
          qty: number
          unit_price_cents: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          line_total_cents: number
          qty: number
          unit_price_cents: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          line_total_cents?: number
          qty?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance_cents: number
          created_at: string
          due_at: string | null
          id: string
          invoice_number: string
          issued_at: string | null
          notes: string | null
          order_id: string | null
          org_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          balance_cents?: number
          created_at?: string
          due_at?: string | null
          id?: string
          invoice_number: string
          issued_at?: string | null
          notes?: string | null
          order_id?: string | null
          org_id: string
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Update: {
          balance_cents?: number
          created_at?: string
          due_at?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string | null
          notes?: string | null
          order_id?: string | null
          org_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      it_tickets: {
        Row: {
          assignee_id: string | null
          category: string | null
          created_at: string
          description: string | null
          first_response_at: string | null
          id: string
          org_id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          reporter_id: string | null
          resolution_due_at: string | null
          resolved_at: string | null
          response_due_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          ticket_number: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          first_response_at?: string | null
          id?: string
          org_id: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          reporter_id?: string | null
          resolution_due_at?: string | null
          resolved_at?: string | null
          response_due_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_number: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          first_response_at?: string | null
          id?: string
          org_id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          reporter_id?: string | null
          resolution_due_at?: string | null
          resolved_at?: string | null
          response_due_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_number?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "it_tickets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          description: string
          id: string
          line_total_cents: number
          order_id: string
          product_id: string | null
          qty: number
          unit_price_cents: number
          uom: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          line_total_cents: number
          order_id: string
          product_id?: string | null
          qty: number
          unit_price_cents: number
          uom?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          line_total_cents?: number
          order_id?: string
          product_id?: string | null
          qty?: number
          unit_price_cents?: number
          uom?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          contract_id: string | null
          created_at: string
          id: string
          notes: string | null
          order_number: string
          org_id: string
          placed_at: string | null
          placed_by: string | null
          po_number: string | null
          requested_delivery_date: string | null
          shipping_address: Json | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          contract_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_number: string
          org_id: string
          placed_at?: string | null
          placed_by?: string | null
          po_number?: string | null
          requested_delivery_date?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Update: {
          contract_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_number?: string
          org_id?: string
          placed_at?: string | null
          placed_by?: string | null
          po_number?: string | null
          requested_delivery_date?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          billing_address: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          credit_limit_cents: number
          id: string
          industry: string | null
          name: string
          payment_terms_days: number
          shipping_address: Json | null
          slug: string
          status: string
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          credit_limit_cents?: number
          id?: string
          industry?: string | null
          name: string
          payment_terms_days?: number
          shipping_address?: Json | null
          slug: string
          status?: string
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          credit_limit_cents?: number
          id?: string
          industry?: string | null
          name?: string
          payment_terms_days?: number
          shipping_address?: Json | null
          slug?: string
          status?: string
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          invoice_id: string
          method: string
          paid_at: string
          reference: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          invoice_id: string
          method: string
          paid_at?: string
          reference?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          invoice_id?: string
          method?: string
          paid_at?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          list_price_cents: number | null
          manufacturer: string | null
          name: string
          search_tsv: unknown
          sku: string
          stock_qty: number
          subcategory: string | null
          uom: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          list_price_cents?: number | null
          manufacturer?: string | null
          name: string
          search_tsv?: unknown
          sku: string
          stock_qty?: number
          subcategory?: string | null
          uom?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          list_price_cents?: number | null
          manufacturer?: string | null
          name?: string
          search_tsv?: unknown
          sku?: string
          stock_qty?: number
          subcategory?: string | null
          uom?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          idp_provider: string | null
          idp_subject: string | null
          job_title: string | null
          last_login_at: string | null
          mfa_enrolled: boolean
          org_id: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          idp_provider?: string | null
          idp_subject?: string | null
          job_title?: string | null
          last_login_at?: string | null
          mfa_enrolled?: boolean
          org_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          idp_provider?: string | null
          idp_subject?: string | null
          job_title?: string | null
          last_login_at?: string | null
          mfa_enrolled?: boolean
          org_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_request_items: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          product_name: string
          quantity: number
          quote_request_id: string
          uom: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          product_name: string
          quantity: number
          quote_request_id: string
          uom?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          product_name?: string
          quantity?: number
          quote_request_id?: string
          uom?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_request_items_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          attachment_path: string | null
          company_name: string
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string
          status: Database["public"]["Enums"]["quote_status"]
          updated_at: string
        }
        Insert: {
          attachment_path?: string | null
          company_name: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
        }
        Update: {
          attachment_path?: string | null
          company_name?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["quote_status"]
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier: string | null
          created_at: string
          delivered_at: string | null
          id: string
          order_id: string
          shipped_at: string | null
          status: string
          tracking_number: string | null
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          order_id: string
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
        }
        Update: {
          carrier?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          order_id?: string
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_documents: {
        Row: {
          created_at: string
          doc_type: string
          file_name: string
          id: string
          size_bytes: number | null
          storage_path: string
          tender_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          doc_type: string
          file_name: string
          id?: string
          size_bytes?: number | null
          storage_path: string
          tender_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          doc_type?: string
          file_name?: string
          id?: string
          size_bytes?: number | null
          storage_path?: string
          tender_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tender_documents_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_items: {
        Row: {
          created_at: string
          description: string
          id: string
          product_id: string | null
          qty: number
          tender_id: string
          unit_price_cents: number | null
          uom: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          product_id?: string | null
          qty: number
          tender_id: string
          unit_price_cents?: number | null
          uom?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          product_id?: string | null
          qty?: number
          tender_id?: string
          unit_price_cents?: number | null
          uom?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_items_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["tender_status"] | null
          id: string
          note: string | null
          tender_id: string
          to_status: Database["public"]["Enums"]["tender_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["tender_status"] | null
          id?: string
          note?: string | null
          tender_id: string
          to_status: Database["public"]["Enums"]["tender_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["tender_status"] | null
          id?: string
          note?: string | null
          tender_id?: string
          to_status?: Database["public"]["Enums"]["tender_status"]
        }
        Relationships: [
          {
            foreignKeyName: "tender_status_history_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          awarded_at: string | null
          buyer_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          org_id: string
          reference: string
          status: Database["public"]["Enums"]["tender_status"]
          submission_deadline: string | null
          title: string
          updated_at: string
          value_cents: number | null
        }
        Insert: {
          awarded_at?: string | null
          buyer_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          org_id: string
          reference: string
          status?: Database["public"]["Enums"]["tender_status"]
          submission_deadline?: string | null
          title: string
          updated_at?: string
          value_cents?: number | null
        }
        Update: {
          awarded_at?: string | null
          buyer_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          org_id?: string
          reference?: string
          status?: Database["public"]["Enums"]["tender_status"]
          submission_deadline?: string | null
          title?: string
          updated_at?: string
          value_cents?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tenders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_comments: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          internal: boolean
          ticket_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          internal?: boolean
          ticket_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          internal?: boolean
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "it_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      create_invoice_from_order: {
        Args: { _order_id: string }
        Returns: string
      }
      current_org_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_audit: {
        Args: {
          _action: string
          _after?: Json
          _before?: Json
          _resource_id: string
          _resource_type: string
        }
        Returns: undefined
      }
      next_invoice_number: { Args: never; Returns: string }
      next_order_number: { Args: never; Returns: string }
      next_ticket_number: { Args: never; Returns: string }
      notify_user: {
        Args: {
          _body?: string
          _link?: string
          _title: string
          _type: string
          _user_id: string
        }
        Returns: string
      }
      record_payment: {
        Args: {
          _amount_cents: number
          _invoice_id: string
          _method: string
          _reference?: string
        }
        Returns: string
      }
      resolve_contract_price: {
        Args: { _product_id: string; _qty?: number }
        Returns: number
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "procurement_officer"
        | "finance"
        | "it_manager"
        | "compliance"
        | "executive"
      invoice_status:
        | "draft"
        | "issued"
        | "partially_paid"
        | "paid"
        | "overdue"
        | "cancelled"
      order_status:
        | "draft"
        | "submitted"
        | "confirmed"
        | "picking"
        | "packed"
        | "shipped"
        | "in_transit"
        | "delivered"
        | "cancelled"
      quote_status: "new" | "in_review" | "quoted" | "closed"
      tender_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "clarification_requested"
        | "awarded"
        | "declined"
        | "closed"
      ticket_priority: "low" | "medium" | "high" | "critical"
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_client"
        | "resolved"
        | "closed"
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
      app_role: [
        "admin",
        "procurement_officer",
        "finance",
        "it_manager",
        "compliance",
        "executive",
      ],
      invoice_status: [
        "draft",
        "issued",
        "partially_paid",
        "paid",
        "overdue",
        "cancelled",
      ],
      order_status: [
        "draft",
        "submitted",
        "confirmed",
        "picking",
        "packed",
        "shipped",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      quote_status: ["new", "in_review", "quoted", "closed"],
      tender_status: [
        "draft",
        "submitted",
        "under_review",
        "clarification_requested",
        "awarded",
        "declined",
        "closed",
      ],
      ticket_priority: ["low", "medium", "high", "critical"],
      ticket_status: [
        "open",
        "in_progress",
        "waiting_client",
        "resolved",
        "closed",
      ],
    },
  },
} as const
