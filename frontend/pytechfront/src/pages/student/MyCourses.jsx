import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance';

const MyCourses = () => {
    const [courses,setCourses] =  useState([]);

    useEffect(()=>{
        const fetchEntrolledCourses = async () =>{
            try {
                const res = await axiosInstance.get("/courses/enrollment")
                const courseList = res.data.map((entrollment)=>entrollment.course)
                setCourses(courseList)
            } catch (error) {
                console.error("Failed to fetch enrolled courses",err);
            }
        }
        fetchEntrolledCourses();
    },[])

    if (!courses.length) return <div>You haven't entrolled in any courses yet.</div>

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>My Enrolled Courses</h1>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {courses.map((course)=>(
            <div key={course.id} className='bg-white rounded-xl border shadow p-4'>
                <img src={course.course_image} alt={course.title} className='h-40 w-full object-cover rounded mb-3'/>
                <h2 className='font-semibold text-lg'>{course.title}</h2>
                <p className='text-sm text-gray-600 mb-2'>{course.category_name}</p>
                <p className='text-sm text-gray-500 line-clamp-2'>{course.description}</p>
                <button className='mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
                    Continue Learning
                </button>
            </div>
        ))}

      </div>
    </div>
  )
}

export default MyCourses
