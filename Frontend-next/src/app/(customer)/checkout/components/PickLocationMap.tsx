"use client";

import { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import { Input } from "antd";
import { showNotificationError } from "@/src/@core/utils/message";
import { AimOutlined, CheckCircleOutlined } from "@ant-design/icons";
import SWTButton from "@/src/@core/component/AntD/SWTButton";

const containerStyle = { width: "100%", height: "600px" };
const LIBRARIES: ("places")[] = ["places"];
const defaultCenter = { lat: 10.7769, lng: 106.7009 };

export default function PickLocationMap({ onSelect, onSave, initialAddress }: any) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const [search, setSearch] = useState(initialAddress || "");
  const [locating, setLocating] = useState(false);
  const [position, setPosition] = useState<any>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Hàm chuyển tọa độ thành địa chỉ
  const fetchAddress = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const address = results[0].formatted_address;
        setSearch(address);
        onSelect?.({ lat, lon: lng, address });
      }
    });
  };

  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || place.name || "";

    setPosition({ lat, lng });
    setSearch(address);
    map?.panTo({ lat, lng });
    onSelect?.({ lat, lon: lng, address });
  };

  const handleMapAction = (lat: number, lng: number) => {
    setPosition({ lat, lng });
    fetchAddress(lat, lng);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return showNotificationError("GPS không khả dụng");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        handleMapAction(lat, lng);
        map?.panTo({ lat, lng });
        setLocating(false);
      },
      () => {
        setLocating(false);
        showNotificationError("Vui lòng bật quyền GPS");
      }
    );
  };

  if (!isLoaded) return <div className="h-[600px] flex items-center justify-center">Đang tải bản đồ...</div>;

  return (
    <div className="h-[650px] w-full relative overflow-hidden rounded-b-xl border-t">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] z-[1000]">
        <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
          <Input
            placeholder="Tìm địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="large"
            allowClear
            className="shadow-xl"
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position || defaultCenter}
        zoom={position ? 17 : 13}
        onClick={(e) => e.latLng && handleMapAction(e.latLng.lat(), e.latLng.lng())}
        onLoad={(map) => setMap(map)}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {position && (
          <Marker 
            position={position} 
            draggable 
            onDragEnd={(e) => e.latLng && handleMapAction(e.latLng.lat(), e.latLng.lng())} 
          />
        )}
      </GoogleMap>

      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col items-end gap-3">
        <SWTButton
          type="primary"
          icon={<CheckCircleOutlined />}
          className="shadow-2xl h-12 px-8 rounded-full font-bold flex items-center gap-2"
          onClick={onSave}
          title="Xác nhận vị trí"
        >Xác nhận</SWTButton>
        <SWTButton
          shape="circle"
          icon={<AimOutlined />}
          loading={locating}
          onClick={handleGetCurrentLocation}
          className="shadow-2xl border-none h-12 w-12 bg-white hover:bg-gray-100 flex items-center justify-center"
        />
      </div>
    </div>
  );
}