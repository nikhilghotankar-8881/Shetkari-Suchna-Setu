import { useMemo } from 'react';

/**
 * Evaluates a scheme against the farmer profile.
 * 
 * Returns:
 * {
 *   status: 'green' | 'yellow' | 'blue' | 'grey',
 *   matchedConditions: string[],
 *   missingConditions: string[],
 *   mismatchedConditions: string[],
 *   requiredDocs: string[],
 *   score: number // for sorting: green (100+) > yellow (50+) > blue (30+) > grey (0)
 * }
 */
export function evaluateEligibility(scheme, profile) {
  if (!scheme) {
    return { status: 'yellow', matchedConditions: [], missingConditions: [], mismatchedConditions: [], requiredDocs: [], score: 50 };
  }

  // If farmer has no profile at all, return yellow (more info needed)
  if (!profile) {
    return {
      status: 'yellow',
      matchedConditions: [],
      missingConditions: ['Profile details needed'],
      mismatchedConditions: [],
      requiredDocs: scheme.required_docs || ['7/12', '8-a', 'farmer_id'],
      score: 50
    };
  }

  const matchedConditions = [];
  const missingConditions = [];
  const mismatchedConditions = [];
  const requiredDocs = scheme.required_docs || ['7/12', '8-a', 'farmer_id'];

  // Normalize land area in hectares
  let landAreaHa = null;
  if (profile.land_area) {
    const rawArea = parseFloat(profile.land_area);
    if (!isNaN(rawArea) && rawArea > 0) {
      landAreaHa = profile.land_unit === 'acre' ? rawArea * 0.404686 : rawArea;
    }
  }

  // 1. Check District
  if (Array.isArray(scheme.districts) && scheme.districts.length > 0) {
    if (!profile.district) {
      missingConditions.push('district_unknown');
    } else if (scheme.districts.includes(profile.district)) {
      matchedConditions.push('district_matched');
    } else {
      mismatchedConditions.push('district_not_eligible');
    }
  } else {
    matchedConditions.push('statewide_applicable');
  }

  // 2. Check Crops / Sector
  if (Array.isArray(scheme.crops) && scheme.crops.length > 0) {
    if (scheme.crops.includes('none') || scheme.crops.includes('student_only')) {
      // Non-agricultural / Student scheme
      mismatchedConditions.push('non_agricultural_scope');
    } else if (scheme.crops.includes('fodder_grass') || scheme.crops.includes('dairy_only')) {
      // Livestock scheme - requires livestock/fodder in crops
      const hasLivestock = (profile.crops || []).includes('fodder_grass');
      if (hasLivestock) {
        matchedConditions.push('livestock_matched');
      } else {
        mismatchedConditions.push('livestock_profile_mismatch');
      }
    } else {
      // Normal crops check
      const profileCrops = profile.crops || [];
      const hasCropMatch = scheme.crops.some(c => profileCrops.includes(c));
      if (hasCropMatch) {
        matchedConditions.push('crop_matched');
      } else if (profileCrops.length === 0) {
        missingConditions.push('crops_not_specified');
      } else {
        mismatchedConditions.push('crops_not_eligible');
      }
    }
  } else {
    matchedConditions.push('all_crops_eligible');
  }

  // 3. Check Landholding
  if (scheme.min_land_ha != null || scheme.max_land_ha != null) {
    if (landAreaHa == null) {
      missingConditions.push('land_area_unknown');
    } else {
      if (scheme.min_land_ha != null && landAreaHa < scheme.min_land_ha) {
        mismatchedConditions.push('land_below_minimum');
      } else if (scheme.max_land_ha != null && landAreaHa > scheme.max_land_ha) {
        mismatchedConditions.push('land_above_maximum');
      } else {
        matchedConditions.push('land_area_matched');
      }
    }
  }

  // 4. Check Land Ownership / Tenancy
  if (scheme.requires_ownership) {
    if (!profile.land_ownership) {
      missingConditions.push('land_ownership_unknown');
    } else if (profile.land_ownership === scheme.requires_ownership) {
      matchedConditions.push('ownership_matched');
    } else {
      mismatchedConditions.push('ownership_mismatch');
    }
  }

  // 5. Check Irrigation
  if (scheme.requires_irrigation === 'yes') {
    if (!profile.irrigation) {
      missingConditions.push('irrigation_unknown');
    } else if (profile.irrigation === 'yes') {
      matchedConditions.push('irrigation_matched');
    } else if (profile.irrigation === 'partial') {
      // Needs verification of seasonal water source
      missingConditions.push('irrigation_proof_needed');
    } else {
      mismatchedConditions.push('irrigation_not_available');
    }
  }

  // 6. Check Farmer ID requirement
  const hasFarmerId = Boolean(profile.farmer_id && profile.farmer_id.trim().length > 0);
  const needsFarmerId = scheme.requires_farmer_id && !hasFarmerId;

  // Determine final status & sorting score
  let status = 'green';
  let score = 100 + matchedConditions.length;

  if (mismatchedConditions.length > 0) {
    status = 'grey';
    score = 0;
  } else if (needsFarmerId) {
    status = 'blue';
    score = 40 + matchedConditions.length;
  } else if (scheme.category_en === 'Micro-irrigation assistance' && profile.irrigation === 'partial') {
    status = 'yellow';
    score = 60 + matchedConditions.length;
  } else if (missingConditions.length > 0) {
    status = 'yellow';
    score = 60 + matchedConditions.length;
  }

  return {
    status,
    matchedConditions,
    missingConditions,
    mismatchedConditions,
    requiredDocs,
    needsFarmerId,
    score
  };
}

/**
 * React hook to evaluate a scheme or list of schemes against profile
 */
export function useEligibilityMatch(scheme, profile) {
  return useMemo(() => {
    return evaluateEligibility(scheme, profile);
  }, [scheme?.id, profile?.district, profile?.land_area, profile?.land_unit, profile?.land_ownership, profile?.irrigation, profile?.farmer_id, JSON.stringify(profile?.crops)]);
}
