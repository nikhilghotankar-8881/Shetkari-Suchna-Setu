from typing import List, Dict, Any


def is_potentially_relevant(
    notice_fields: Dict[str, Any],
    profile_district: str,
    profile_taluka: str = None,
    profile_crops: List[str] = None,
) -> bool:
    """
    Computes profile matching against notice criteria:
    - Region match: If notice specifies regions, profile district/taluka must overlap.
      Empty notice regions implies state-wide applicability.
    - Crop match: If notice specifies crops, at least one of profile's crops must overlap.
      Empty notice crops implies all crops / general farmer applicability.

    Note: The output signifies 'potentially relevant', NEVER legally 'eligible'.
    """
    profile_crops = profile_crops or []
    notice_regions = [r.strip().lower() for r in notice_fields.get("regions", []) if r.strip()]
    notice_crops = [c.strip().lower() for c in notice_fields.get("crops", []) if c.strip()]

    # 1. Region check
    region_match = True
    if notice_regions:
        profile_dist_clean = (profile_district or "").strip().lower()
        profile_tal_clean = (profile_taluka or "").strip().lower()

        # Check if district or taluka matches any notice region
        match_found = False
        for nr in notice_regions:
            if "state" in nr or "all" in nr or nr == profile_dist_clean or (profile_tal_clean and nr == profile_tal_clean):
                match_found = True
                break
        region_match = match_found

    if not region_match:
        return False

    # 2. Crop check
    crop_match = True
    if notice_crops:
        if not profile_crops:
            # If farmer didn't specify crops yet, don't rule out crop notices
            crop_match = True
        else:
            profile_crops_set = {c.strip().lower() for c in profile_crops}
            # Check for set intersection
            crop_match = any(nc in profile_crops_set or "all" in nc for nc in notice_crops)

    return crop_match
