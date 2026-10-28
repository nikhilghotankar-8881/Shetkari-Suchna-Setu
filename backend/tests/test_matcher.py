from app.services.matcher import is_potentially_relevant


def test_statewide_and_all_crops_matches_any_farmer():
    fields = {
        "regions": [],  # Statewide
        "crops": [],    # All crops
    }
    assert is_potentially_relevant(fields, profile_district="Nashik", profile_crops=["Soybean"]) is True
    assert is_potentially_relevant(fields, profile_district="Pune", profile_crops=["Sugarcane"]) is True


def test_district_match():
    fields = {
        "regions": ["Nashik", "Dhule"],
        "crops": [],
    }
    # Matches Nashik farmer
    assert is_potentially_relevant(fields, profile_district="Nashik") is True
    # Does not match Kolhapur farmer
    assert is_potentially_relevant(fields, profile_district="Kolhapur") is False


def test_crop_intersection_match():
    fields = {
        "regions": ["Amravati"],
        "crops": ["Cotton", "Soybean"],
    }
    # Farmer in Amravati growing Cotton matches
    assert is_potentially_relevant(
        fields,
        profile_district="Amravati",
        profile_crops=["Cotton", "Wheat"]
    ) is True

    # Farmer in Amravati growing only Sugarcane does not match
    assert is_potentially_relevant(
        fields,
        profile_district="Amravati",
        profile_crops=["Sugarcane"]
    ) is False
