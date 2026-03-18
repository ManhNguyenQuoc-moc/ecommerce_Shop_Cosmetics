"use client";

import { useEffect, useState, useRef } from "react";
import { Input, Spin } from "antd";

interface Address {
  address: string;
  lat: number;
  lon: number;
}

interface Props {
  value?: string;
  onChange?: (data: Address) => void;
}

export default function AddressAutocomplete({ value, onChange }: Props) {
  const [query, setQuery] = useState(value || "");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Click ngoài dropdown → đóng
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gọi API khi gõ
  useEffect(() => {
    if (!query || query.length < 3) {
      setOptions([]);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchPlaces(query), 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const fetchPlaces = async (text: string) => {
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        text
      )}&format=json&countrycodes=vn&limit=5`;

      const res = await fetch(url);
      const data = await res.json();

      setOptions(Array.isArray(data) ? data : []);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const address = item.display_name;

    setQuery(address);
    setShowDropdown(false);
    onChange?.({ address, lat, lon });
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <Input
        placeholder="Tìm địa chỉ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 3 && setShowDropdown(true)}
        size="large"
        allowClear
      />

      {showDropdown && (loading || options.length > 0) && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg mt-1 max-h-[250px] overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center">
              <Spin size="small" />
            </div>
          ) : options.length > 0 ? (
            options.map((item) => (
              <div
                key={item.place_id || item.display_name}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-none"
                onClick={() => handleSelect(item)}
              >
                {item.display_name}
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-400 text-center">
              Không tìm thấy kết quả
            </div>
          )}
        </div>
      )}
    </div>
  );
}