import React, { useEffect, useRef, useState } from "react";

interface MediaDeviceSelectorProps {
  onSelect: (data: MediaStream) => void;
  type: "audio" | "video";
}

export default function MediaDeviceSelector({
  onSelect,
  type,
}: MediaDeviceSelectorProps) {
  const localStorageKey =
    type === "video" ? "selectedvideodeviceid" : "selectedaudiodeviceid";
  const [selectDeviceId, setSelectDeviceId] = useState<string>("");
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>();
  const selectElementRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (selectDeviceId) {
      handleSelectionChange(selectDeviceId);
    }
  }, [selectDeviceId]);

  async function handleSelectionChange(deviceId: string) {
    const device = await navigator.mediaDevices?.getUserMedia(
      type === "video"
        ? {
            video: { deviceId: deviceId },
          }
        : {
            audio: { deviceId: deviceId },
          }
    );
    localStorage.setItem(localStorageKey, deviceId);
    onSelect(device);
  }

  useEffect(() => {
    async function initialize() {
      if (selectElementRef.current) selectElementRef.current.focus();

      await navigator.mediaDevices.getUserMedia(
        type === "video" ? { video: true } : { audio: true }
      );

      let devices = await navigator.mediaDevices.enumerateDevices();

      if (!devices) {
        const val = await navigator.mediaDevices.getUserMedia(
          type === "video" ? { video: true } : { audio: true }
        );
        onSelect(val);
        return;
      }

      devices = devices.filter(
        (d) => d.kind === (type === "video" ? "videoinput" : "audioinput")
      );

      setMediaDevices(devices);

      const storedSelectDeviceId = localStorage.getItem(localStorageKey);
      if (storedSelectDeviceId) {
        setSelectDeviceId(storedSelectDeviceId);
      }
    }

    initialize();
  }, [type, localStorageKey, onSelect]);

  return (
    <label className="p-2 flex flex-col space-y-2">
      <p className="text-xs font-bold px-2">
        Select {type === "video" ? "Camera" : "Mic"}
      </p>
      <select
        value={selectDeviceId}
        ref={selectElementRef}
        onChange={(e) => setSelectDeviceId(e.target.value)}
        className="px-4 py-1 border border-black/40 rounded bg-transparent overflow-hidden text-sm text-ellipsis w-[300px] disabled:text-black/40"
        disabled={!mediaDevices}
      >
        {mediaDevices ? (
          mediaDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))
        ) : (
          <option value="">Loading...</option>
        )}
      </select>
    </label>
  );
}
