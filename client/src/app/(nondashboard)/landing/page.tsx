"use client";

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';
import Image from 'next/image';
import { useCarousel } from '@/hooks/useCarousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCoursesQuery } from '@/state/api';
import { useRouter } from 'next/navigation';
import CourseCardSearch from '@/components/CourseCardSearch';
import { useUser } from '@clerk/nextjs';

const LoadingSkeleton = () => {
    return (
        <div className="w-3/4">
            <div className="flex justify-between items-center mt-12 h-[500px] rounded-lg bg-customgreys-secondarybg">
                <div className="basis-1/2 px-16 mx-auto">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-4 w-96 mb-2" />
                    <Skeleton className="h-4 w-72 mb-8" />
                    <Skeleton className="w-40 h-10" />
                </div>
                <Skeleton className="basis-1/2 h-full rounded-r-lg" />
            </div>
            <div className="mx-auto py-12 mt-10">
                <Skeleton className="h-6 w-48 mb-4"/>
                <Skeleton className="h-4 w-full max-w-2xl mb-8"/>
                <div className="flex flex-wrap gap-4 mb-8">
                    {[1,2,3,4,5].map((_, index) => (
                        <Skeleton key={index} className="w-24 h-6 rounded-full"/>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1,2,3,4].map((_, index) => (
                        <Skeleton key={index} className="h-[300px] rounded-lg"/>
                    ))}
                </div>
            </div>
        </div>
    )
}

const Landing = () => {

  const router = useRouter();

  const handleCourseClick = (courseId: string) => {
    router.push(`/search?id=${courseId}`, {
        scroll: false,
    });
  };

  const { data: courses, isLoading, isError } = useGetCoursesQuery({})
  console.log(courses)

  const currentImage = useCarousel({totalImages: 3})

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5}} 
        className="w-3/4"
    >
        <motion.div 
            initial={{ y: 20, opacity: 0}} 
            animate={{ y: 0, opacity: 1}} 
            transition={{ duration: 0.5}} 
            className="flex justify-between items-center mt-12 h-[500px] rounded-lg bg-customgreys-secondarybg"
        >
            <div className="basis-1/2 px-16 mx-auto">
                <h1 className="text-4xl font-bold mb-4">Cursos</h1>
                <p className="text-lg text-gray-400 mb-8">Essa é a lista de cursos que você pode fazer!
                    <br/>
                    Os melhores cursos para você aprender o que quiser.
                </p>
                <div className="w-fit">
                    <Link href="/search" scroll={false}>
                        <div className="bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-md">Procurar por cursos</div>
                    </Link>
                </div>
            </div>
            <div className="basis-1/2 h-full relative overflow-hidden rounded-r-lg">
                {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"].map((src, index) => (
                    <Image 
                        key={src} 
                        src={src} 
                        alt={`Hero Banner ${index + 1}`}
                        fill
                        priority={index === currentImage}
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                        className={`object-cover transition-opacity duration-500 opacity-0 ${
                            index === currentImage ? "opacity-100" : ""
                        } `}
                    />
                )   
                )}
            </div>
        </motion.div>
        <motion.div
            initial={{ opacity: 0}} 
            whileInView={{ opacity: 1}} 
            transition={{ duration: 0.5}} 
            viewport={{ amount: 0.3, once: true}}
            className="mx-auto py-12 mt-10"
        >
            <h2 className="text-2xl font-semibold mb-4">
                Nossos cursos
            </h2>
            <p className="text-customgreys-dirtyGrey mb-8">
                Do básico ao avançado, em todos os campos, temos os cursos que você precisa para se tornar um profissional de sucesso.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
                {[
                    "desenvolvimento web", 
                    "design", 
                    "marketing", 
                    "negócios", 
                    "programação", 
                    "data science"
                ].map((tag, index) => (
                    <span 
                        key={index} 
                        className="px-3 py-1 bg-customgreys-secondarybg rounded-full text-sm"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses &&
                    courses.slice(0, 4).map((course, index) => (
                        <motion.div
                            key={course.courseId}
                            initial={{y: 50, opacity: 0}}
                            whileInView={{ y: 0, opacity: 1}}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ amount: 0.4 }}
                        >
                            <CourseCardSearch 
                                course={course} 
                                onClick={() => handleCourseClick(course.courseId)}
                            />
                        </motion.div>
                    ))
                }
            </div>
        </motion.div>
    </motion.div>
  )
}

export default Landing