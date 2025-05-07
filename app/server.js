const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Fix: Use `app.post("/rpc")` instead of `app.get("/rpc")`
app.post("/rpc", async (req, res) => {
  try {
    const response = await fetch("https://orchard.rpc.quai.network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("RPC Error:", error);
    res.status(500).json({ error: "RPC request failed" });
  }
});

// ✅ Start the server
app.listen(3001, () =>
  console.log("🚀 RPC Proxy running on http://localhost:3001")
);
