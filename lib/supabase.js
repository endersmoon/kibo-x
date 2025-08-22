// Supabase configuration and client setup
// This file shows how to connect the application to Supabase

import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations for requisitions
export const requisitionService = {
  // Get all requisitions
  async getAll() {
    const { data, error } = await supabase
      .from("requisitions")
      .select("*")
      .order("created_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single requisition by ID
  async getById(id) {
    const { data, error } = await supabase
      .from("requisitions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new requisition
  async create(requisition) {
    const { data, error } = await supabase
      .from("requisitions")
      .insert([requisition])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a requisition
  async update(id, updates) {
    const { data, error } = await supabase
      .from("requisitions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a requisition
  async delete(id) {
    const { error } = await supabase.from("requisitions").delete().eq("id", id);

    if (error) throw error;
  },
};

// Database operations for candidates
export const candidateService = {
  // Get all candidates for a requisition
  async getByRequisition(requisitionId) {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("requisition_id", requisitionId)
      .order("applied_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get candidates by stage
  async getByStage(requisitionId, stage) {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("requisition_id", requisitionId)
      .eq("current_stage", stage)
      .order("applied_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single candidate by ID
  async getById(id) {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new candidate
  async create(candidate) {
    const { data, error } = await supabase
      .from("candidates")
      .insert([candidate])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a candidate
  async update(id, updates) {
    const { data, error } = await supabase
      .from("candidates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Move candidate to a different stage
  async moveToStage(id, newStage) {
    const { data, error } = await supabase
      .from("candidates")
      .update({
        current_stage: newStage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a candidate
  async delete(id) {
    const { error } = await supabase.from("candidates").delete().eq("id", id);

    if (error) throw error;
  },

  // Bulk update candidates (useful for reordering)
  async bulkUpdate(updates) {
    const { data, error } = await supabase
      .from("candidates")
      .upsert(updates)
      .select();

    if (error) throw error;
    return data;
  },
};

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to requisition changes
  subscribeToRequisitions(callback) {
    return supabase
      .channel("requisitions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requisitions",
        },
        callback,
      )
      .subscribe();
  },

  // Subscribe to candidate changes for a specific requisition
  subscribeToCandidates(requisitionId, callback) {
    return supabase
      .channel(`candidates-${requisitionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "candidates",
          filter: `requisition_id=eq.${requisitionId}`,
        },
        callback,
      )
      .subscribe();
  },

  // Unsubscribe from a channel
  unsubscribe(subscription) {
    supabase.removeChannel(subscription);
  },
};

// Utility functions
export const utils = {
  // Generate a unique ID for new records
  generateId(prefix = "") {
    return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Format dates for database insertion
  formatDate(date) {
    return new Date(date).toISOString().split("T")[0];
  },

  // Format datetime for database insertion
  formatDateTime(date) {
    return new Date(date).toISOString();
  },
};

// Environment variables you need to set:
// NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

// Example usage in components:
/*
import { requisitionService, candidateService } from '@/lib/supabase';

// Get all requisitions
const requisitions = await requisitionService.getAll();

// Get candidates for a specific requisition
const candidates = await candidateService.getByRequisition('req-001');

// Move a candidate to a different stage
await candidateService.moveToStage('cand-001', 'technical_interview');

// Subscribe to real-time updates
const subscription = subscriptions.subscribeToCandidates('req-001', (payload) => {
  console.log('Candidate updated:', payload);
});

// Clean up subscription
subscriptions.unsubscribe(subscription);
*/
