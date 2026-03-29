import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/** Baray area, Kampong Thom province — cooperative land reference point */
const LAT = 12.5867;
const LON = 104.8667;

const position: [number, number] = [LAT, LON];

const landPinIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function CooperativeLocationMap() {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300 shadow-inner">
      <MapContainer
        center={position}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full z-0 [&_.leaflet-control-attribution]:text-[10px]"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={landPinIcon}>
          <Popup>
            <span className="text-sm font-medium">Cooperative land</span>
            <br />
            <span className="text-xs text-gray-600">
              Lat: {LAT}° N, Lon: {LON}° E
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
