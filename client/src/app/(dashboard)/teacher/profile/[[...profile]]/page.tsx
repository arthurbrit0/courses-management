import Header from '@/components/Header'
import { UserProfile } from '@clerk/nextjs'
import React from 'react'
import { dark } from '@clerk/themes'

const TeacherProfilePage = () => {
  return (
    <>
        <Header title="Perfil" subtitle="Veja seu perfil" />
        <UserProfile 
            path="/teacher/profile"
            routing="path"
            appearance={{
                baseTheme: dark,
                elements: {
                    scrollBox: "bg-customgreys-darkGrey",
                    navbar: {
                        "& > div>nth-child(1)": {
                            background: "none"
                        }
                    }
                }
            }}
        />
    </>
  )
}

export default TeacherProfilePage