import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { entities } from '@/api/supabaseClient';

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    entities.UserProfile.list("-created_date", 1)
      .then((list) => {
        setProfile(list.length > 0 ? list[0] : null);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  // Determine current stage based on visa type
  const getCurrentStage = () => {
    if (!profile) return null;
    const visa = profile.current_visa_type;
    if (visa === "500") return "student";
    if (visa === "485") return "graduate";
    if (visa === "189" || visa === "190" || visa === "491") return "pr";
    return null;
  };

  // Get next recommended stage
  const getNextStage = () => {
    const stage = getCurrentStage();
    if (stage === "student") return "graduate";
    if (stage === "graduate") return profile?.skills_assessment_done ? "eoi" : "skills";
    if (stage === "skills") return "eoi";
    if (stage === "eoi") return "state";
    return null;
  };

  // English score helpers
  const getEnglishLevel = () => {
    if (!profile?.english_score || !profile?.english_test_type) return null;
    const score = parseFloat(profile.english_score);
    if (profile.english_test_type === "IELTS") {
      if (score >= 8.0) return "superior";
      if (score >= 7.0) return "proficient";
      if (score >= 6.0) return "competent";
      return "below";
    }
    if (profile.english_test_type === "PTE") {
      if (score >= 79) return "superior";
      if (score >= 65) return "proficient";
      if (score >= 50) return "competent";
      return "below";
    }
    return null;
  };

  return { profile, loading, getCurrentStage, getNextStage, getEnglishLevel };
}