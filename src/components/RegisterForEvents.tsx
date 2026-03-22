"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface RegisterForEventProps {
  eventName: string;
  maxPart: number;
  minPart: number;
  regFees: number;
}

export default function RegisterForEvent({
  eventName,
  maxPart,
  minPart,
  regFees,
}: RegisterForEventProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState<string[]>(
    Array(minPart).fill("")
  );

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [transactionId, setTransactionId] = useState("");

  // ================= PARTICIPANTS =================
  const handleAddParticipant = () => {
    if (participants.length < maxPart) {
      setParticipants((prev) => [...prev, ""]);
    }
  };

  const handleRemoveParticipant = (index: number) => {
    if (participants.length > minPart) {
      const updated = [...participants];
      updated.splice(index, 1);
      setParticipants(updated);
    }
  };

  const handleParticipantChange = (index: number, value: string) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async () => {
    console.log("BUTTON CLICKED");
  console.log("Upload started"); // ✅ check trigger

  if (!image) {
    console.log("No file selected");
    return;
  }

  const formData = new FormData();
  formData.append("file", image);

  try {
    const res = await axios.post("/api/cloudinary/upload", formData);

    console.log("FULL RESPONSE:", res.data); // ✅ most important

    const url = res.data.uploads.file?.secure_url 
             || res.data.uploads.undefined?.secure_url;

    console.log("IMAGE URL:", url);

    setImageUrl(url);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
  }
};

  // ================= FINAL SUBMIT =================
  const handleSubmit = async () => {
    if (!teamName.trim()) {
      setError("Team name required");
      return;
    }

    if (!imageUrl) {
      setError("Please upload payment screenshot first");
      return;
    }

    if (!transactionId) {
      setError("Transaction ID required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("/api/payAndRegisterForEvent", {
        eventName,
        teamName,
        members: participants,
        paymentProof: imageUrl,
        transactionId,
      });

      alert("Submitted! Verification pending.");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-lg mx-auto p-6 bg-black/80 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">
        Register for {eventName}
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Team Name */}
      <input
        type="text"
        placeholder="Team Name"
        className="w-full mb-3 p-2 rounded"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      {/* Participants */}
      {participants.map((p, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder={`Participant ${i + 1}`}
            className="w-full p-2 rounded"
            value={p}
            onChange={(e) =>
              handleParticipantChange(i, e.target.value)
            }
          />
          {participants.length > minPart && (
            <button
              onClick={() => handleRemoveParticipant(i)}
              className="bg-red-500 px-2 rounded"
            >
              X
            </button>
          )}
        </div>
      ))}

      {participants.length < maxPart && (
        <button
          onClick={handleAddParticipant}
          className="bg-green-600 px-3 py-1 rounded mb-3"
        >
          + Add Participant
        </button>
      )}

      {/* Payment Section */}
      <div className="mt-4 text-center">
        {/* <img src="/scseqr.png" alt="QR" className="w-40 mx-auto mb-2" /> */}
        <p className="text-white">Pay ₹{regFees}</p>
      </div>

      {/* File Upload */}
      <input
  type="file"
  onChange={(e) => {
    const file = e.target.files?.[0];
    console.log("SELECTED FILE:", file); // 👈 add this

    if (file) setImage(file);
  }}
/>

      <button
        onClick={handleImageUpload}
        className="bg-blue-600 w-full mt-2 py-2 rounded"
        disabled={loading}
      >
        {loading
          ? "Uploading..."
          : imageUrl
          ? "Uploaded ✅"
          : "Upload Screenshot"}
      </button>

      {/* Transaction ID */}
      <input
        type="text"
        placeholder="Transaction ID"
        className="w-full mt-3 p-2 rounded"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-purple-600 w-full mt-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Please wait..." : "Submit"}
      </button>
    </div>
  );
}