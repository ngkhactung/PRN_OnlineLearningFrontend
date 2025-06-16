import React from 'react'

function Courses({ course }) {
  return (
    <div className="col-sm-6 col-lg-4">
      <div className="single_special_cource">
        <img
          src={course.image || "img/special_cource_1.png"}
          className="special_img"
          alt={course.title}
        />
        <div className="special_cource_text">
          <a href={`/course-details/${course.id}`} className="btn_4">
            {course.category}
          </a>
          <h4>${course.price}</h4>
          <a href={`/course-details/${course.id}`}>
            <h3>{course.title}</h3>
          </a>
          <p>{course.description}</p>
          <div className="author_info">
            <div className="author_img">
              <img 
                src={course.author?.image || "img/author/author_1.png"} 
                alt={course.author?.name} 
              />
              <div className="author_info_text">
                <p>Conduct by:</p>
                <h5>
                  <a href="#">{course.author?.name}</a>
                </h5>
              </div>
            </div>
            <div className="author_rating">
              <div className="rating">
                {[...Array(5)].map((_, index) => (
                  <a href="#" key={index}>
                    <img 
                      src={index < Math.floor(course.rating) 
                        ? "img/icon/color_star.svg" 
                        : "img/icon/star.svg"} 
                      alt="" 
                    />
                  </a>
                ))}
              </div>
              <p>{course.rating} Ratings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses