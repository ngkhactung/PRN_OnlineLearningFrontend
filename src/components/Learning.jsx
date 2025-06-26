import React from "react";
import { Link } from "react-router-dom";

function Learning() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="w-full md:w-7/12 lg:w-7/12">
            <div className="relative">
              <img
                src="img/learning_img.png"
                alt="Learning"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-5/12 lg:w-5/12">
            <div className="space-y-6">
              <h5 className="text-lg font-medium uppercase text-gray-600">
                About us
              </h5>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-950 leading-tight">
                Learning with Love and Laughter
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Fifth saying upon divide divide rule for deep their female all
                hath brind Days and beast greater grass signs abundantly have
                greater also days years under brought moveth.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">
                    <i className="ti-pencil-alt text-xl"></i>
                  </span>
                  <span className="text-gray-600">
                    Him lights given i heaven second yielding seas gathered wear
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">
                    <i className="ti-ruler-pencil text-xl"></i>
                  </span>
                  <span className="text-gray-600">
                    Fly female them whales fly them day deep given night.
                  </span>
                </li>
              </ul>

              <Link
                to="/about"
                href="#"
                className="inline-block px-8 py-3 bg-orange-500 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Learning;
