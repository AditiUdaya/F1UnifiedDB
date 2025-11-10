import { useState } from "react";
import { motion } from "framer-motion";

const SQL = () => {
  const [displayText, setDisplayText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [driverId, setDriverId] = useState("1"); // default driver id

  const procedureLines = [
    "USE f1UnifiedDB;",
    "",
    "DELIMITER $$",
    "CREATE PROCEDURE GetLapsByDriver(IN driver_id INT)",
    "BEGIN",
    "   SELECT LapNo, LapTime, Position, RaceID",
    "   FROM lap",
    "   WHERE DriverID = driver_id;",
    "END $$",
    "DELIMITER ;",
    "",
  ];

  const runProcedure = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setDisplayText("");

    // Typing animation
    for (const line of procedureLines) {
      setDisplayText((prev) => prev + line + "\n");
      await new Promise((r) => setTimeout(r, 100));
    }

    setDisplayText((prev) => prev + `\n> CALL GetLapsByDriver(${driverId});\n`);

    try {
      const res = await fetch(`http://localhost:5000/procedure/laps/${driverId}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setDisplayText((prev) => prev + "\n⚠️ No results found.\n");
      } else {
        const header = Object.keys(data[0]).join(" | ");
        const rows = data
          .map((r: any) => Object.values(r).join(" | "))
          .join("\n");

        setDisplayText(
          (prev) =>
            prev +
            "--------------------------------------------------\n" +
            header +
            "\n--------------------------------------------------\n" +
            rows +
            "\n--------------------------------------------------\n\n Procedure executed successfully.\n"
        );
      }
    } catch (err: any) {
      setDisplayText((prev) => prev + `\n❌ Error: ${err.message}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-orbitron text-4xl font-bold text-foreground">
          ADVANCED <span className="text-gradient-racing">SQL</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Run stored procedures dynamically on the{" "}
          <span className="text-[#ff073a]">LAP</span> table.
        </p>
      </motion.div>

      {/* input field */}
      <div className="flex items-center gap-3">
        <label className="font-mono text-white">Driver ID:</label>
        <input
          type="number"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          className="font-mono bg-black border border-[#ff073a] text-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#ff073a]"
          style={{ boxShadow: "0 0 15px #ff073a" }}
        />
      </div>

      {/* terminal box */}
      <div
        className="font-mono text-white text-lg"
        style={{
          backgroundColor: "#000",
          padding: "20px",
          borderRadius: "12px",
          minHeight: "400px",
          whiteSpace: "pre-wrap",
          overflowY: "auto",
          boxShadow: "0 0 25px #ff073a",
          border: "1px solid #ff073a",
        }}
      >
        {displayText}
        <span className="animate-pulse text-[#ff073a]">█</span>
      </div>

      {/* run button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={runProcedure}
          disabled={isRunning}
          className="px-6 py-2 font-mono text-lg rounded-md transition-all duration-300"
          style={{
            backgroundColor: isRunning ? "#661020" : "#ff073a",
            color: "#ffffff",
            boxShadow: isRunning
              ? "0 0 15px #ff073a inset"
              : "0 0 20px #ff073a, 0 0 40px #ff073a",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          {isRunning ? "RUNNING..." : "RUN PROCEDURE"}
        </button>
      </div>
    </div>
  );
};

export default SQL;
