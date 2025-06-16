import React from "react";

function SidebarCourseDetail() {
  return (
    <div className="w-full lg:w-1/3 px-4 mt-8 lg:mt-0">
      <div className="lg:sticky lg:top-24">
        <img
          className="w-full rounded-lg shadow-md"
          src="img/single_cource.png"
          alt="Course"
        />
        <div className="p-6 mb-8">
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <p className="text-gray-600">Trainer's Name</p>
              <span className="text-black font-semibold">George Mathews</span>
            </li>
            <li className="flex justify-between items-center">
              <p className="text-gray-600">Course Fee</p>
              <span className="text-black font-semibold">$230</span>
            </li>
            <li className="flex justify-between items-center">
              <p className="text-gray-600">Available Seats</p>
              <span className="text-black font-semibold">15</span>
            </li>
            <li className="flex justify-between items-center">
              <p className="text-gray-600">Schedule</p>
              <span className="text-black font-semibold">
                2.00 pm to 4.00 pm
              </span>
            </li>
          </ul>
          <button className="w-full mt-6 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-500 hover:scale-105 transition-all ease-in-out">
            Enroll the course
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarCourseDetail;
