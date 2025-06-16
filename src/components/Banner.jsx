import React from "react";

function Banner() {
  return (
    <section className="bg-white py-20 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="w-full lg:w-1/2 xl:w-1/2">
            <div className="space-y-6">
              <div className="space-y-6">
                <h5 className="text-lg font-medium text-gray-600">
                  Every child yearns to learn
                </h5>
                <h1 className="text-4xl md:text-5xl font-bold text-blue-950 leading-tight">
                  Making Your Childs
                  <br />
                  World Better
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Replenish seasons may male hath fruit beast were seas saw you
                  arrie said man beast whales his void unto last session for
                  bite. Set have great you'll male grass yielding yielding man
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#"
                    className="inline-block px-8 py-3 bg-orange-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
                  >
                    View Course
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
