import React from 'react';

const courseList = [
  {
    id: 'webdev',
    title: 'Web Development',
    salary: '$127,005 average salary(us)',
    openRoles: '16,500 open roles(us)',
    rating: '⭐ 4.7',
    ratingCount: '442k rating',
    totalHours: '87.6 total hours',
    image: 'Capture1.png',
    url: 'https://www.udemy.com/career/full-stack-web-developer/'
  },
  {
    id: 'digitalmarketer',
    title: 'Digital Marketer',
    salary: '$61,126 average salary(us)',
    openRoles: '36,600 open roles(us)',
    rating: '⭐ 4.6',
    ratingCount: '3.3k rating',
    totalHours: '28.4 total hours',
    image: 'Capture2.png',
    url: 'https://www.udemy.com/career/digital-marketer/'
  },
  {
    id: 'datascientist',
    title: 'Data Scientist',
    salary: '$126,629 average salary(us)',
    openRoles: '20,800 open roles(us)',
    rating: '⭐ 4.6',
    ratingCount: '216k rating',
    totalHours: '46.8 total hours',
    image: 'Capture3.png',
    url: 'https://www.udemy.com/career/data-scientist/'
  },
  {
    id: 'pythonbootcamp',
    title: '100 Days of Code: The Complete Python Pro Bootcamp',
    salary: '$127,005 average salary(us)',
    openRoles: '16,500 open roles(us)',
    rating: '⭐ 4.7',
    ratingCount: '442k rating',
    totalHours: '87.6 total hours',
    image: 'lear.png',
    url: 'https://www.udemy.com/course/100-days-of-code/'
  },
  {
    id: 'fullstackbootcamp',
    title: 'The Complete Full-Stack Web Development Bootcamp',
    salary: '$61,126 average salary(us)',
    openRoles: '36,600 open roles(us)',
    rating: '⭐ 4.6',
    ratingCount: '3.3k rating',
    totalHours: '28.4 total hours',
    image: 'learn1.png',
    url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/?couponCode=CP130525'
  },
  {
    id: 'awscloud',
    title: '[NEW] Ultimate AWS Certified Cloud Practitioner CLF-C02 2025',
    salary: '$126,629 average salary(us)',
    openRoles: '20,800 open roles(us)',
    rating: '⭐ 4.6',
    ratingCount: '216k rating',
    totalHours: '46.8 total hours',
    image: 'learn2.png',
    url: 'https://www.udemy.com/course/aws-certified-cloud-practitioner-new/'
  }
];

const Home = () => {
  return (
    <div>
      <div><br /></div>
      <div id="pandacar">
        {courseList.slice(0, 3).map(course => (
          <div
            key={course.id}
            id={`card${course.id}`}
            className="card"
            style={{ width: '23rem', cursor: 'pointer' }}
            onClick={(e) => {
              window.open(course.url);
              e.preventDefault();
            }}
          >
            <img src={course.image} className="card-img-top" alt={course.title} />
            <div className="card-body">
              <h5 className="card-title"><b>{course.title}</b></h5>
              <p className="card-text">
                {course.salary} • {course.openRoles}<br />
                <label id="c1">{course.rating}</label>
                <label id="c1"> {course.ratingCount}</label>
                <label id="c1"> {course.totalHours}</label>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div><br /></div>
      <div id="learndcard">
        {courseList.slice(3).map(course => (
          <div
            key={course.id}
            id={`card${course.id}`}
            className="card"
            style={{ width: '23rem', cursor: 'pointer' }}
            onClick={(e) => {
              window.open(course.url);
              e.preventDefault();
            }}
          >
            <img src={course.image} className="card-img-top" alt={course.title} />
            <div className="card-body">
              <h5 className="card-title"><b>{course.title}</b></h5>
              <p className="card-text">
                {course.salary} • {course.openRoles}<br />
                <label id="c1">{course.rating}</label>
                <label id="c1"> {course.ratingCount}</label>
                <label id="c1"> {course.totalHours}</label>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
