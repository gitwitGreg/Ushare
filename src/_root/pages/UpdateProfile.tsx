"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AuthContext } from "@/context/AuthContext"
import { INITIAL_USER } from "@/context/AuthUtils"
import { useContext, useState } from "react"
import { ProfileValidation } from "@/lib/validation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useUpdateUserInfo } from "@/lib/reactQuery/queriesAndMutations"


const UpdateProfile = () => {
  const { user } = useContext(AuthContext) || {INITIAL_USER}
  const [ newFile, setNewFile ] = useState<File[]>([]);
  const { mutateAsync: updateUserInfo } = useUpdateUserInfo();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (e : any) => {
    console.log('starting');
    console.log(e.target)
    const file = e.target.files;
    setNewFile(file);
  };



  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name:  user?.name,
      username: user?.username,
      bio: user?.bio,
      email: user?.email,
    } as {
      file: File[];
      name: string;
      username: string;
      bio: string;
      email: string;
    },
  })

  if(!user){
    <div>No User</div>
  }

  const onSubmit = (values: z.infer<typeof ProfileValidation>) => {
    console.log('starting user update');
    updateUserInfo({
      userId: values.username,
      name: values.name,
      bio: values.bio,
      file : newFile,
      email: String(user?.email),
    })
    console.log('succesful Updatee');
  }



  return (
    <div className="ml-10 mt-10">
      <div className="flex items-center gap-2">
        <img 
        src='/assets/edit.svg'
        className="h-8 w-8"/>
        <h1 className="font-bold text-2xl">Edit Profile</h1>
      </div>
      <div className="flex gap-4 items-center">
        <Label htmlFor="picture">
          <img 
          src={user?.imageUrl || '/assets/profile-placeholder.svg'}
          className='rounded-full h-[150px] w-[150px] mt-10'
          />
        </Label>
        <Input 
          className="w-[40%] mt-4 border-none text-blue-500"
         placeholder='Change Profile Picture' type="file"
         onChange={handleFileChange}
         />
      </div>
      <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="flex-col gap-9 w-full max-w-5xl"
      >
         <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
              className="text-white">
                Name
                </FormLabel>
              <FormControl>
                < Input
                type='text'
                className=" h-[50px] bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[600px] rounded sm:w-[65%]"
                {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
           )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
              className="text-white">
                Username
                </FormLabel>
              <FormControl>
                < Input 
                type='text'
                className=" h-[50px] bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[600px] rounded sm:w-[65%]"
                {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
           )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
              className="text-white">
                Email
                </FormLabel>
              <FormControl>
                < Input
                type='text'
                className=" h-[50px] bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[600px] rounded sm:w-[65%]"
                {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
           )}
        />


        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
              className="shad-form_label">
                Add Tags seperated by (" , ")
                </FormLabel>
              <FormControl>
                < Textarea
                className=" h-[50px] bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[600px] rounded sm:w-[65%]"
                {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className=" mt-6 gap-8 items-center flex justify-end mr-36">
        <Button 
          type="button"
          className="shad-button_dark_4"
          >
            Cancel
          </Button>
          <Button 
          type="submit"
          className=" bg-primary-500 hover:bg-primary-500 text-light-1 flex gap-2 h-12 sm:mr-20"
          >
            Update Profile
          </Button>
        </div>
      </form>
      </Form>
    </div>
  )
}

export default UpdateProfile
