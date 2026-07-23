import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix default icon paths (used as fallback)
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

export type WasteType = "plastic" | "paper" | "glass" | "metal" | "ewaste";

export const WASTE_LABELS: Record<WasteType, string> = {
  plastic: "البلاستيك",
  paper: "الورق",
  glass: "الزجاج",
  metal: "المعادن",
  ewaste: "النفايات الإلكترونية",
};

const WASTE_COLORS: Record<WasteType, string> = {
  plastic: "#0c6b4f",
  paper: "#c98a1d",
  glass: "#2b7fbf",
  metal: "#7a7a7a",
  ewaste: "#8e44ad",
};

export interface RecyclingPoint {
  id: string;
  name: string;
  wilaya: string;
  commune?: string;
  address?: string;
  notes?: string;
  waste: WasteType;
  lat: number;
  lng: number;
}

const diamondIcon = (waste: WasteType) => {
  const color = WASTE_COLORS[waste];
  const html = `<div style="width:22px;height:22px;background:${color};transform:rotate(45deg);border:2px solid #fdfdfd;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.25)"></div>`;
  return L.divIcon({
    html,
    className: "greendz-diamond",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
};

function ClickCapture({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const WILAYA_CENTERS: Record<string, [number, number]> = {
  "الجزائر": [36.7538, 3.0588],
  "وهران": [35.6971, -0.6337],
  "قسنطينة": [36.365, 6.6147],
  "عنابة": [36.9, 7.7667],
  "بجاية": [36.7509, 5.0567],
  "تلمسان": [34.8828, -1.315],
  "سطيف": [36.19, 5.41],
  "باتنة": [35.55, 6.17],
  "ورقلة": [31.95, 5.32],
  "تمنراست": [22.785, 5.5228],
};

export default function RecyclingMap({
  points,
  filter,
  pickMode,
  onPick,
}: {
  points: RecyclingPoint[];
  filter: WasteType | "all";
  pickMode: boolean;
  onPick?: (lat: number, lng: number) => void;
}) {
  const filtered = useMemo(
    () => (filter === "all" ? points : points.filter((p) => p.waste === filter)),
    [points, filter]
  );

  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="h-[520px] rounded-3xl bg-grey animate-pulse" />;

  return (
    <div className="relative h-[520px] overflow-hidden rounded-3xl border border-border shadow-sm">
      <MapContainer
        center={[28.5, 2.8]}
        zoom={5}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", cursor: pickMode ? "crosshair" : "" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pickMode && onPick && <ClickCapture onPick={onPick} />}
        {filtered.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={diamondIcon(p.waste)}>
            <Popup>
              <div dir="rtl" style={{ fontFamily: "Noto Sans Arabic, Tajawal, sans-serif", minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{p.wilaya}{p.commune ? ` — ${p.commune}` : ""}</div>
                <div style={{ margin: "6px 0" }}>
                  <span style={{
                    display: "inline-block", padding: "2px 10px", borderRadius: 999,
                    background: WASTE_COLORS[p.waste], color: "#fff", fontSize: 11, fontWeight: 600,
                  }}>{WASTE_LABELS[p.waste]}</span>
                </div>
                {p.address && <div style={{ fontSize: 12 }}>{p.address}</div>}
                {p.notes && <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{p.notes}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {filtered.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 top-4 rounded-2xl bg-white/95 px-5 py-3 text-center text-sm font-medium text-ink shadow-md">
          لا توجد نقاط في هذه المنطقة بعد… كن أول من يضيف واحدة!
        </div>
      )}
    </div>
  );
}
