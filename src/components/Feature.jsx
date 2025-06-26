import React from "react";
import { Laugh, ShieldCheck, PartyPopper } from "lucide-react";
function Feature() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Feature Header */}
          <div className="flex items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-950 leading-tight">
                Awesome <br /> Feature
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Set have great you male grass yielding an yielding first their
                you're have called the abundantly fruit were man
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-4">
              <span className="inline-block p-4 bg-orange-100 text-orange-500 rounded-lg">
                <Laugh />
              </span>
              <h4 className="text-xl font-semibold text-blue-950">
                Better Future
              </h4>
              <p className="text-gray-600">
                Set have great you male grasses yielding yielding first their to
                called deep abundantly Set have great you male
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-4">
              <span className="inline-block p-4 bg-orange-100 text-orange-500 rounded-lg">
                <ShieldCheck />
              </span>
              <h4 className="text-xl font-semibold text-blue-950">
                Qualified Trainers
              </h4>
              <p className="text-gray-600">
                Set have great you male grasses yielding yielding first their to
                called deep abundantly Set have great you male
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-4">
              <span className="inline-block p-4 bg-orange-100 text-orange-500 rounded-lg">
                <PartyPopper />
              </span>
              <h4 className="text-xl font-semibold text-blue-950">
                Job Oppurtunity
              </h4>
              <p className="text-gray-600">
                Set have great you male grasses yielding yielding first their to
                called deep abundantly Set have great you male
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Feature;
