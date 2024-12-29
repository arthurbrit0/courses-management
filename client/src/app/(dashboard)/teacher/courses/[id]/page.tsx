import { useGetCourseQuery, useUpdateCourseMutation } from '@/state/api';
import { useAppDispatch, useAppSelector } from '@/state/redux';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router'
import React from 'react'

const CourseEditor = () => {

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: course, isLoading, refetch } = useGetCourseQuery(id);

  const [updateCourse] = useUpdateCourseMutation();
  // upload video functionality
  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  return (
    <div>CourseEditor</div>
  )
}

export default CourseEditor