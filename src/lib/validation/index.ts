import * as z from 'zod'


export const SignupValidation = z.object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters'
    }).max(50),
    name: z.string().min(3, {
        message: 'name must be at least 3 characters'
    }),
    password: z.string().min(9, {
      message: 'password must be atleast 9 characters'
    }).max(50),
    email: z.string().min(10).max(50)
  })

  export const PostValidation = z.object({
    caption: z.string().max(2250),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string(),
  })

  export const ProfileValidation = z.object({
    name: z.string().max(2250),
    username: z.string().max(2250),
    profileImg: z.custom<File[]>(),
    email: z.string().min(2).max(100),
    bio: z.string(),
  })
