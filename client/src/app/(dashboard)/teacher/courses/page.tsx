"use client";

import Header from '@/components/Header';
import Loading from '@/components/Loading';
import TeacherCourseCard from '@/components/TeacherCourseCard';
import Toolbar from '@/components/Toolbar';
import { Button } from '@/components/ui/button';
import { useCreateCourseMutation, useDeleteCourseMutation, useGetCoursesQuery } from '@/state/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'

const CoursesPage = () => {

  const router = useRouter();
  const { user } = useUser();
  const { data: courses, isLoading, isError } = useGetCoursesQuery({ category: "all"});

  const [createCourse] = useCreateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      return course.title.toLowerCase().includes(searchTerm.toLowerCase()) 
       &&
      (selectedCategory === "all" || course.category === selectedCategory)
    })

  }, [courses, searchTerm, selectedCategory]);

  const handleEdit = (course: Course) => {
    router.push(`/teacher/courses/${course.courseId}`);
  }

  const handleDelete = async (course: Course) => {
    if (window.confirm("Você tem certeza que quer deletar este curso?")) {
        await deleteCourse(course.courseId).unwrap();
    }
  }

  const handleCreateCourse = async () => {
    if (!user) return;

    const result = await createCourse({
        teacherId: user.id,
        teacherName: user.fullName || "Professor",
    }).unwrap();

    router.push(`/teacher/courses/${result.courseId}`);
  };

  if (isLoading) return <Loading />
  if (isError || !courses) return <div>Erro ao carregar cursos</div>

  return (
    <div className="w-full h-full">
        <Header 
            title="Meus Cursos" 
            subtitle="Acompanhe os cursos que você possui"
            rightElement={
                <Button
                    onClick={handleCreateCourse}
                    className="bg-primary-700 hover:bg-primary-600"
                >
                     Criar Curso
                </Button>
            }
        />
        <Toolbar
            onSearch={setSearchTerm}
            onCategoryChange={setSelectedCategory}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-6 w-full">
            {filteredCourses.map((course) => (
                <TeacherCourseCard 
                    key={course.courseId}
                    course={course}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isOwner={course.teacherId === user?.id}
                />
            ))}
        </div>

    </div>
  )
}

export default CoursesPage