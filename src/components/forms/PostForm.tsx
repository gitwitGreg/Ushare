"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "./FileUploader"
import { PostValidation } from "@/lib/validation"
import { useMakeNewPost} from "@/lib/reactQuery/queriesAndMutations"
import { useGetCurrUser } from "@/lib/reactQuery/queriesAndMutations"
import { toast} from "@/components/ui/use-toast"

type PostFormProps = {
  post?: {
    caption: string,
    location: string,
    tags: string[],
    file: URL,
    imageUrl?: string,
  }
}


export const PostForm = ({ post }: PostFormProps) => {

  const {mutateAsync: createPost, isPending: isPosting} = useMakeNewPost();
  const {mutateAsync: getCurrUser, isPending: isGettingUser} = useGetCurrUser();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post? post.caption: '',
      file: [],
      location: post? post.location: '',
      tags: post? post.tags.join(','): ''
    },
  })


   async function onSubmit(values: z.infer<typeof PostValidation>) {
    try{
      const currUser = await getCurrUser();
      const url = URL.createObjectURL(values.file[0]);
      if(currUser){
        await createPost({
          caption: values.caption,
          file: url,
          tags: values.tags,
          location: values.location,
          userId: currUser?.username,
          instructorId: String(Date.now()),
          likes: [''],
        })
        toast({
          description: 'Post was succesful'
        })
        form.reset();
      }
      else{
        console.log('No User');
      }
    }catch(error){
      console.log(error);
    }
    }
    
  return (
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
              className="shad-form_label">
                Caption
                </FormLabel>
              <FormControl>
                < Textarea 
                className=" w-[600px] bg-dark-3 rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3"
                {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
              className="shad-form_label">
                Add Photo
                </FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange} 
                  mediaUrl={post?.imageUrl} 
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
              className="text-white">
                Add Location
                </FormLabel>
              <FormControl>
                < Input
                type='text'
                className=" h-[50px] bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[600px] rounded sm:w-[65%]"
                {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
        </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel 
              className="shad-form_label">
                Add Tags (seperated by ",")
                </FormLabel>
              <FormControl>
                < Input
                type="text"
                className=" h-[50px] bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[600px] rounded sm:w-[65%]"
                {...field}
                placeholder="People, Places, More"/>
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
            Submit
          </Button>
          <Button 
          type="submit"
          className=" bg-primary-500 hover:bg-primary-500 text-light-1 flex gap-2 h-12 sm:mr-20"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
