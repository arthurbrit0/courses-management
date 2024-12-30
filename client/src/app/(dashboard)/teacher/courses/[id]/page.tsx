"use client";

import { CustomFormField } from '@/components/CustomFormField';
import DroppableComponent from '@/components/Droppable';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { courseSchema } from '@/lib/schemas';
import { centsToDollars, createCourseFormData } from '@/lib/utils';
import { openSectionModal, setSections } from '@/state';
import { useGetCourseQuery, useUpdateCourseMutation } from '@/state/api';
import { useAppDispatch, useAppSelector } from '@/state/redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import ChapterModal from './ChapterModal';
import SectionModal from './SectionModal';

const CourseEditor = () => {

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: course, isLoading, refetch } = useGetCourseQuery(id);

  const [updateCourse] = useUpdateCourseMutation();

  // upload video functionality

  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  const methods = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
        courseTitle: "",
        courseDescription: "",
        courseCategory: "",
        coursePrice: "0",
        courseStatus: false,
    }
  });

  useEffect(() => {
    if (course) {
        methods.reset({
            courseTitle: course.title,
            courseDescription: course.description,
            courseCategory: course.category,
            coursePrice: centsToDollars(course.price),
            courseStatus: course.status === "Publicado",
        });
        dispatch(setSections(course.sections || []));
    }
  }, [course, methods]);

  const onSubmit = async (data: CourseFormData) => {
    try {
        const formData = createCourseFormData(data, sections);
        const updatedCourse = await updateCourse({
            courseId: id,
            formData
        }).unwrap();

        // await uploadAllVideos(sections, updatedCourse.sections, id, uploadVideo);

        refetch();

    } catch (error) {
        console.error("Falha ao atualizar o curso: ", error);
    }
  }

  return (
    <div>
        <div className="flex items-center gap-5 mb-5">
            <button 
                className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2"
                onClick={() => router.push("/teacher/courses")}
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar aos cursos</span>
            </button>
        </div>
        <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Header
                    title="Editar Curso"
                    subtitle="Atualize as informações do seu curso"
                    rightElement={
                        <div className="flex items-center space-x-4">
                            <CustomFormField
                                name="courseStatus"
                                type="switch"
                                label={methods.watch("courseStatus") ? "Publicado" : "Rascunho"}
                                className="flex items-center space-x-2"
                                labelClassName={`text-sm font-medium ${
                                    methods.watch("courseStatus")
                                      ? "text-green-500"
                                      : "text-yellow-500"
                                }`}
                                inputClassName="data-[state=checked]:bg-green-500"
                            />
                            <Button
                                type="submit"
                                className="bg-primary-700 hover:bg-primary-600">
                                {
                                    methods.watch("courseStatus")
                                      ? "Atualizar e Publicar"
                                      : "Salvar rascunho"
                                }
                            </Button>
                        </div>
                    }
                    />
                    {/* FORMULARIO EM SI */}
                    <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
                        <div className="basis-1/2">
                            <div className="space-y-4">
                                <CustomFormField
                                    name="courseTitle"
                                    type="text"
                                    label="Título do Curso"
                                    placeholder="Digite o título do curso"
                                    className="border-none"
                                    initialValue={course?.title}
                                />

                                <CustomFormField
                                    name="courseDescription"
                                    type="textarea"
                                    label="Descrição do Curso"
                                    placeholder="Digite a descrição do curso"
                                    initialValue={course?.description}
                                />

                                <CustomFormField
                                    name="courseCategory"
                                    type="text"
                                    label="Categoria do Curso"
                                    placeholder="Digite a categoria do curso"
                                    initialValue={course?.category}
                                    options={[
                                        { value: "technology", label: "Tecnologia" },
                                        { value: "science", label: "Ciência" },
                                        { value: "mathematics", label: "Matemática" },
                                        { value: "Artificial Intelligence", label: "Inteligência Artificial" },
                                    ]}
                                />

                                <CustomFormField
                                    name="coursePrice"
                                    type="number"
                                    label="Preço do Curso"
                                    placeholder="0"
                                    initialValue={centsToDollars(course?.price)}
                                />
                            </div>
                        </div>
                        <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-2xl font-semibold text-secondary-foreground">
                                    Seções do Curso
                                </h2>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => dispatch(openSectionModal({ sectionIndex: null }))}
                                    className="border-none text-primary-700 group"
                                >
                                    <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                                    <span className="text-primary-700 group-hover:white-100">
                                        Adicionar seção
                                    </span>
                                </Button>
                            </div>

                            { isLoading ? (
                                <p>Carregando o conteúdo dos cursos</p>
                            ): sections.length > 0 ? (
                                <DroppableComponent />
                            ) : (
                                <p>Seções não disponíveis</p>
                            )}
                        </div>
                    </div>
            </form>
        </Form>

        <ChapterModal />
        <SectionModal />
    </div>
  )
}

export default CourseEditor