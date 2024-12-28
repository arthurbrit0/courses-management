import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL });
  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.data) {
      result.data = result.data.data;
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

  }),
});

export const {
  useUpdateUserMutation,
  useGetCoursesQuery,
  useGetCourseQuery
} = api;