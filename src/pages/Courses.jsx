import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useState } from "react";
import { useEffect } from "react";
import React from "react";
function Courses() {
  const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalCourses / itemsPerPage);

  // Fetch courses data
  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  // Get course data
  const fetchCourses = async () => {
    try {
    //   setLoading(true);
      //  Pagination từ server
      const response = null;
      setCourses(response.data.courses);
      setTotalCourses(response.data.totalCount);
    } catch (err) {
    //   setError("Failed to fetch courses");
      console.error("Error fetching courses:", err);
    } finally {
    //   setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top khi chuyển trang
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

//   if (loading) {
//     return (
//       <div>
//         <Header />
//         <div
//           className="d-flex justify-content-center align-items-center"
//           style={{ minHeight: "400px" }}
//         >
//           <div className="spinner-border text-primary" role="status">
//             <span className="sr-only">Not courses available</span>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div>
//         <Header />
//         <div
//           className="d-flex justify-content-center align-items-center"
//           style={{ minHeight: "400px" }}
//         >
//           <div className="spinner-border text-primary" role="status">
//             <span className="sr-only">Loading...</span>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <Header />
//         <div
//           className="container text-center"
//           style={{ minHeight: "400px", paddingTop: "150px" }}
//         >
//           <h3>Error loading courses</h3>
//           <p>{error}</p>
//           <button className="btn btn-primary" onClick={fetchCourses}>
//             Try Again
//           </button>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

  return (
    <div>
      <Header />

      <section className="special_cource padding_top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5">
              <div className="section_tittle text-center">
                <p>popular courses</p>
                <h2>Special Courses</h2>
              </div>
            </div>
          </div>

          {/* Course Items */}
          <div className="row">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No courses available</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {/* Course count info */}
          <div className="row mt-3">
            <div className="col-12 text-center">
              <p className="text-muted">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalCourses)} of{" "}
                {totalCourses} courses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="testimonial_part section_padding">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-5">
              <div className="section_tittle text-center">
                <p>testimonials</p>
                <h2>Happy Students</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="textimonial_iner owl-carousel">
                {/* Testimonial content giữ nguyên hoặc cũng có thể fetch từ API */}
                <div className="testimonial_slider">
                  <div className="row">
                    <div className="col-lg-8 col-xl-4 col-sm-8 align-self-center">
                      <div className="testimonial_slider_text">
                        <p>
                          Behold place was a multiply creeping creature his
                          domin to thiren open void hath herb divided divide
                          creepeth living shall i call beginning third sea
                          itself set
                        </p>
                        <h4>Michel Hashale</h4>
                        <h5> Sr. Web designer</h5>
                      </div>
                    </div>
                    <div className="col-lg-4 col-xl-2 col-sm-4">
                      <div className="testimonial_slider_img">
                        <img src="img/testimonial_img_1.png" alt="#" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Courses;
