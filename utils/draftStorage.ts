// Draft storage utilities for offline access
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DraftCase {
  id: string;
  propertyId?: string;
  propertyAddress?: string;
  buildingNumber?: string;
  caseDescription?: string;
  caseUrgencyLevel?: "high" | "moderate" | "low";
  assessmentLevel?: "standard" | "detailed";
  isUrgent?: boolean;
  optionalTenantName?: string;
  optionalLandlordName?: string;
  damages: DraftDamage[];
  createdAt: string;
  updatedAt: string;
}

export interface DraftDamage {
  id: string;
  damageLocation: string;
  damageType: string;
  damageDescription: string;
  damageDate: string;
  photos: DraftPhoto[];
}

export interface DraftPhoto {
  id: string;
  photoType: string;
  photoUrl: string; // Local URI for photos stored on device
  description?: string;
  localUri: string; // Local file path
}

const DRAFT_STORAGE_KEY = "@draft_cases";

// Get all drafts
export async function getAllDrafts(): Promise<DraftCase[]> {
  try {
    const draftsJson = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
    if (!draftsJson) return [];
    return JSON.parse(draftsJson);
  } catch (error) {
    console.error("Error getting drafts:", error);
    return [];
  }
}

// Save a draft
export async function saveDraft(draft: DraftCase): Promise<void> {
  try {
    const drafts = await getAllDrafts();
    const existingIndex = drafts.findIndex((d) => d.id === draft.id);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = { ...draft, updatedAt: new Date().toISOString() };
    } else {
      drafts.push(draft);
    }
    
    await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error("Error saving draft:", error);
    throw error;
  }
}

// Get a specific draft
export async function getDraft(draftId: string): Promise<DraftCase | null> {
  try {
    const drafts = await getAllDrafts();
    return drafts.find((d) => d.id === draftId) || null;
  } catch (error) {
    console.error("Error getting draft:", error);
    return null;
  }
}

// Delete a draft
export async function deleteDraft(draftId: string): Promise<void> {
  try {
    const drafts = await getAllDrafts();
    const filteredDrafts = drafts.filter((d) => d.id !== draftId);
    await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filteredDrafts));
  } catch (error) {
    console.error("Error deleting draft:", error);
    throw error;
  }
}

// Generate a new draft ID
export function generateDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

