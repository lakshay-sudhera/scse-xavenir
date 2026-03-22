"use client";

import { useState } from "react";

export default function TestPaymentPage() {
  const [form, setForm] = useState({
    email: "",
    scseId: "",
    paymentProof: "",
    transactionId1: "",
    transactionId2: "",
    transactionId3: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/collegepay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      setResponse({
        httpStatus: res.status,
        data,
      });
    } catch (err) {
      setResponse({ error: "Request failed" });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Test Payment API</h1>

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <br />

      <input
        name="scseId"
        placeholder="SCSE ID"
        onChange={handleChange}
      />
      <br />

      <input
        name="paymentProof"
        placeholder="Payment Proof URL"
        onChange={handleChange}
      />
      <br />

      <input
        name="transactionId1"
        placeholder="Transaction ID 1"
        onChange={handleChange}
      />
      <br />

      <input
        name="transactionId2"
        placeholder="Transaction ID 2"
        onChange={handleChange}
      />
      <br />

      <input
        name="transactionId3"
        placeholder="Transaction ID 3"
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Sending..." : "Submit"}
      </button>

      <hr />

      {response && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
}