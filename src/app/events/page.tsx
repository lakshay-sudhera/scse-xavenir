"use client";

import RegisterForEvent from "@/components/RegisterForEvent";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-blue-900 p-8">

      <h1 className="text-3xl font-bold text-white text-center mb-10">
        Events Registration
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Example Event 1 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-2">
            Hackathon
          </h2>

          <p className="text-gray-300 mb-4">
            Team-based coding event
          </p>

          <RegisterForEvent
            eventName="Hackathon"
            minPart={2}
            maxPart={5}
            regFees={200}
          />
        </div>

        {/* Example Event 2 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-2">
            Coding Contest
          </h2>

          <p className="text-gray-300 mb-4">
            Individual competition
          </p>

          <RegisterForEvent
            eventName="CodingContest"
            minPart={1}
            maxPart={1}
            regFees={100}
          />
        </div>

        {/* Example Event 3 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-2">
            AI Challenge
          </h2>

          <p className="text-gray-300 mb-4">
            Build AI solutions
          </p>

          <RegisterForEvent
            eventName="AIChallenge"
            minPart={2}
            maxPart={4}
            regFees={300}
          />
        </div>

      </div>

    </div>
  );
}