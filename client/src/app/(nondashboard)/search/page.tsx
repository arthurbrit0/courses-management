"use client";

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useGetCoursesQuery } from '@/state/api';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import CourseCardSearch from '@/components/CourseCard';
import SelectedCourse from './SelectedCourse';

const Search = () => {
  
  const searchParams = useSearchParams();                                           // hook para pegar os parâmetros da URL
  const id = searchParams.get("id");                                                // pega o parâmetro id da URL
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});             // hook para pegar os cursos da API
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);        // estado para armazenar o curso selecionado
  const router = useRouter();                                                       // hook para navegar entre as páginas

  useEffect(() => {                                                                 
    if (courses) {                                                                  // se existir algum curso
        if(id){                                                                     // se existir um id (algum dos cursos estiver selecionado)                                       
            const course = courses.find((c) => c.courseId === id);                  // procuramos o curso com id igual ao id passado na URL
            setSelectedCourse(course || courses[0]);                                // se encontrarmos o curso, setamos ele como curso selecionado, senão setamos o primeiro curso da lista
        } else {                                                                    // se não existir um id
            setSelectedCourse(courses[0]);                                          // setamos o primeiro curso da lista como curso selecionado  
        }
    }
  }, [courses, id]);

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Erro ao carregar os cursos</div>;

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);                                                      // seta o curso selecionado
    router.push(`/search?id=${course.courseId}`);                                   // navega para a página do curso selecionado
  }

  const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`)
  }
 
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col bg-[#1B1C22] h-full mx-auto w-3/4"
    >
        <h1 className="text-white font-normal text-2xl mt-14">Lista de cursos disponíveis</h1>
        <h2 className="text-gray-500 mb-3">{courses.length} cursos disponíveis</h2>
        <div className="w-full flex flex-col-reverse md:flex-row pb-8 pt-2 gap-8">
        <motion.div
            initial={{y: 40, opacity: 0}}
            animate={{ y: 0, opacity: 1}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="basis-3/5 grid grid-cols-1 xl:grid-cols-2 gap-6 auto-rows-fr"
        >
            {courses.map((course) => ( 
                <CourseCardSearch 
                    key={course.courseId}
                    course={course} 
                    isSelected={selectedCourse?.courseId === course.courseId}
                    onClick={() => handleCourseSelect(course)}
                />
            ))}
        </motion.div>

        {selectedCourse && (
            <motion.div
                initial={{y: 40, opacity: 0}}
                animate={{ y: 0, opacity: 1}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="basis-2/5 min-w-[350px] h-fit border-2 border-primary-600 bg-customgreys-secondarybg overflow-hidden rounded-lg"
            >
                <SelectedCourse
                    course={selectedCourse}
                    handleEnrollNow={handleEnrollNow}
                />
            </motion.div>
        )}
        </div>
    </motion.div>
  )
}

export default Search