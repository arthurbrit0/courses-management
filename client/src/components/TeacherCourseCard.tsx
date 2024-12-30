import Image from 'next/image'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Pencil } from 'lucide-react'

const TeacherCourseCard = ({
    course,
    onEdit,
    onDelete,
    isOwner
}: TeacherCourseCardProps) => {
  return (
    <Card className="w-full h-[400px] p-0 bg-background border-none text-foreground bg-customgreys-primarybg overflow-hidden hover:bg-white-100/10 transition duration-200 flex flex-col group">
        <CardHeader className="p-0 h-[400px] overflow-hidden">
            {course.image && (
                <Image
                    src={course.image}
                    alt={course.title}
                    className="rounded-t-lg w-[100%] h-[100%] object-cover transition-transform"
                    width={370}
                    height={200}
                />
            )}
        </CardHeader>
        <CardContent className="w-full pb-6 pt-4 flex-grow flex flex-col justify-between text-gray-400">
            <div className="flex flex-col">
                <CardTitle className="text-primary-50 text-md md:text-lg line-clamp-2 overflow-hidden">
                    {course.title}
                </CardTitle>
                <CardDescription className="bg-customgreys-dirtyGrey/50 px-2 py-1 mt-3 mb-3 rounded-xl w-fit text-smy">
                    {course.category}
                </CardDescription>
                <p className="text-sm mb-2">
                    Status: {" "}
                    <span className={cn(
                        "font-semibold px-2 py-1 rounded",
                        course.status === "Publicado" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400" 
                     )}
                    >
                        {course.status}
                    </span>
                </p>
                    {course.enrollments && (
                        <p className="ml-1 mt-1 inline-block text-secondary text-sm font-sm">
                            <span className="font-bold text-white-100">
                                {course.enrollments.length} 
                            </span>{" "}
                            Estudante{course.enrollments.length > 1 ? "s" : ""} inscrito{course.enrollments.length > 1 ? "s" : ""}
                        </p>
                    )}
                    </div>
                    <div className="w-full flex gap-2 mt-3 space-y-2 xl:space-y-0">
                        {isOwner ? (
                            <>
                                <div>
                                    <Button

                                        className="rounded w-full bg-primary-700 border-none hover:bg-primary-600 hover:text-customgreys-primarybg text-white-100 cursor-pointer"
                                        onClick={() => onEdit(course)}
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Editar
                                    </Button>
                                </div>
                                <div>
                                    <Button

                                        className="rounded w-full bg-red-600 text-white-100 hover:bg-red-400 hover:text-customgreys-primarybg cursor-pointer"
                                        onClick={() => onDelete(course)}
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Deletar
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Apenas visualização</p>        
                        )}
                    </div>
        </CardContent>
    </Card>
  )
}

export default TeacherCourseCard