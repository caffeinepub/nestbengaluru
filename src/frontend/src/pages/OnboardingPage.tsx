import { useState } from "react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";

const AREAS = [
  "HSR Layout",
  "Koramangala",
  "Whitefield",
  "Electronic City",
  "Indiranagar",
  "BTM Layout",
];

interface Props {
  onDone: () => void;
}

export default function OnboardingPage({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [budget, setBudget] = useState([5000, 12000]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else {
      localStorage.setItem(
        "onboarding-prefs",
        JSON.stringify({ userType, selectedAreas, budget }),
      );
      onDone();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white max-w-md mx-auto">
      {/* Progress */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all"
              style={{ background: i <= step ? "#ff6b6b" : "#e5e7eb" }}
            />
          ))}
        </div>
        <p className="text-sm text-gray-400">Step {step + 1} of 3</p>
      </div>

      <div className="flex-1 px-6">
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What brings you here?
            </h2>
            <p className="text-gray-500 mb-8">
              We'll personalize your PG search
            </p>
            <div className="space-y-3">
              {["Student", "Working Professional"].map((type) => (
                <button
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                    userType === type
                      ? "border-[#ff6b6b] bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <span className="text-2xl block mb-1">
                    {type === "Student" ? "🎓" : "💼"}
                  </span>
                  <span className="font-semibold text-gray-900">{type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Preferred areas?
            </h2>
            <p className="text-gray-500 mb-8">Select all that work for you</p>
            <div className="flex flex-wrap gap-3">
              {AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                    selectedAreas.includes(area)
                      ? "border-[#ff6b6b] bg-[#ff6b6b] text-white"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your monthly budget?
            </h2>
            <p className="text-gray-500 mb-8">Drag to set your range</p>
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#3c4555" }}
                >
                  ₹{budget[0].toLocaleString("en-IN")}
                </span>
                <span className="text-gray-400">—</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#3c4555" }}
                >
                  ₹{budget[1].toLocaleString("en-IN")}
                </span>
              </div>
              <Slider
                min={3000}
                max={20000}
                step={500}
                value={budget}
                onValueChange={setBudget}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>₹3,000</span>
                <span>₹20,000</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-10">
        <Button
          onClick={handleNext}
          disabled={step === 0 && !userType}
          className="w-full h-14 rounded-2xl text-base font-semibold text-white"
          style={{ background: "#ff6b6b", border: "none" }}
        >
          {step < 2 ? "Next" : "Get Started"}
        </Button>
      </div>
    </div>
  );
}
