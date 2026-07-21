const AMENITY_LABELS: Record<string, string> = {
  ac: "AC",
  parking: "Parking",
  wifi: "WiFi",
  "wi-fi": "WiFi",
};

export function amenityKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function amenityLabel(value: string) {
  const trimmed = value.trim();
  return AMENITY_LABELS[amenityKey(trimmed)] ?? trimmed;
}

export function normalizeAmenities(values: string[]) {
  const seen = new Set<string>();

  return values
    .map(amenityLabel)
    .filter((value) => {
      const key = amenityKey(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function parseAmenityList(value: string) {
  const values = value.split(",").flatMap((item) => {
    const trimmed = item.trim();
    const parts = trimmed.split(/\s+/);
    return parts.length > 1 && parts.every((part) => AMENITY_LABELS[amenityKey(part)])
      ? parts
      : trimmed;
  });

  return normalizeAmenities(values);
}
