import CoursePreview from '@/components/CoursePreview';
import { CustomFormField } from '@/components/CustomFormField';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import { GuestFormData, guestSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { Form } from "@/components/ui/form";    
import { useForm } from 'react-hook-form';
import SignInComponent from '@/components/SignIn';
import SignUpComponent from '@/components/SignUp';

const CheckoutDetailsPage = () => {

  const { course: selectedCourse, isLoading, isError } = useCurrentCourse();

  const searchParams = useSearchParams();
  const showSignUp = searchParams.get("showSignUp") === "true";

  const methods = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
            email: "",
        }, 
    });

  if (isLoading) return <Loading />
  if (isError) return <div>Erro ao coletar informações do curso</div>
  if (!selectedCourse) return <div>Curso não encontrado</div>

  return (
    <div className="w-full h-fit gap-10">
        <div className="sm:flex gap-10">
            <div className="basis-1/2 rounded-lg">
                <CoursePreview course={selectedCourse} />
            </div>

        <div className="basis-1/2 flex-1 h-auto flex flex-col gap-10">
          <div className="w-full bg-customgreys-secondarybg py-12 px-24 rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-2">Checkout de convidado</h2>
            <p className="mb-6 text-sm text-center text-gray-400 mx-auto">
              Insira seu e-mail para enviarmos as informações de pagamento e de
              acesso ao curso.
            </p>
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit((data) => {
                  console.log(data);
                })}
                className="space-y-8"
              >
                <CustomFormField
                  name="email"
                  label="Endereço de e-mail"
                  type="email"
                  className="w-full rounded mt-4"
                  labelClassName="font-normal text-white-50"
                  inputClassName="py-3"
                />
                <Button type="submit" className="w-full my-6 py-3 bg-primary-700 hover:bg-primary-600 text-white-100 rounded shadow text-sm font-semibold">
                  Continuar como convidado
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex items-center justify-between">
            <hr className="w-full border-customgreys-dirtyGrey" />
            <span className="px-4 text-sm text-gray-400 whitespace-nowrap">Ou</span>
            <hr className="w-full bg-customgreys-secondarybg flex justify-center items-center rounded-lg" />
          </div>

          <div className="w-full bg-customgreys-secondarybg flex justify-center items-center rounded-lg">
                {showSignUp ? <SignUpComponent /> : <SignInComponent />}
          </div>
        </div>
        </div>
    </div>
  )
}

export default CheckoutDetailsPage