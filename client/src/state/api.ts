import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server"
import { Clerk } from "@clerk/clerk-js"
import { toast } from "sonner";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
     baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
     prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if(token){
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
     }
  });
  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage = errorData?.message || result.error.status.toString() || "Um erro ocorreu.";
      toast.error(`Erro: ${errorMessage}`);
    }

    const isMutationRequest = (args as FetchArgs).method && (args as FetchArgs).method !== "GET";
    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 204
    ) {
      return { data: null };
    }

    return result;
  }
  catch (error) {
    return error;
  }
}

export const api = createApi({                                                      // cria uma instância da api slice que gerenciará as requisicoes para a api
  baseQuery: customBaseQuery,                                                       // define a base url da api
  reducerPath: "api",                                                               // define o caminho no estado global do redux, onde a api slice será armazenada                   
  tagTypes: ["Courses", "Users"],                                                   // define os tipos de tags que a api slice usa para gerenciar cache

  endpoints: (build) => ({

    updateUser: build.mutation<User, Partial<User> & { userId: string}>({
      query: ({ userId, ...updatedUser}) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updatedUser, 
      }),
      invalidatesTags: ["Users"]
    }),
    getCourses: build.query<Course[], { category?: string }>({                      // define um endpoint para buscar cursos, que recebe um parametro opcional category e retorna uma lista de cursos     
      query: ({ category }) => ({                                                   // recebe os parâmetros da consulta
        url: "courses",                                                             // define a url da consulta
        params: { category },                                                       // define os parâmetros da consulta
      }),
      providesTags: ["Courses"],                                                    // define as tags que a consulta fornece
    }),

    getCourse: build.query<Course, string>({                                        // define um endpoint para buscar um curso, que recebe um id e retorna um curso
      query: ( id ) => `courses/${id}`,                                             // define a url da consulta, que recebe o id do curso                       
      providesTags: (result, error, id) => [{ type: "Courses", id }],               // define as tags que a consulta fornece, que são do tipo Courses e tem o id do curso
    }),

    createCourse: build.mutation<Course, { teacherId: string, teacherName: string }>({
      query: (body) => ({
        url: "courses",
        method: "POST",
        body
      }),
      invalidatesTags: ["Courses"]
    }),

    updateCourse: build.mutation<Course, { courseId: string, formData: FormData }>({
      query: ({ courseId, formData}) => ({
        url: `courses/${courseId}`,
        method: "PUT",
        body: formData
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId }
      ]
    }),

    deleteCourse: build.mutation< { message: string }, string>({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"]
    }),

    getTransactions: build.query<Transaction[], string>({ 
      query: (userId) => `transactions?userId=${userId}`,
     }),                          

    createStripePaymentIntent: build.mutation<
      { clientSecret: string },
      { amount: number }>
    ({
      query: (amount) => ({
        url: "/transactions/stripe/payment-intent",
        method: "POST",
        body: { amount }
      })
    }),
    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: "/transactions",
        method: "POST",
        body: transaction
      })
    })
  }),

});

export const {
  useUpdateUserMutation,
  useGetCoursesQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useGetCourseQuery,
  useGetTransactionsQuery,
  useCreateStripePaymentIntentMutation,
  useCreateTransactionMutation
} = api;