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
import { useMakeNewPost, useUpdatePost} from "@/lib/reactQuery/queriesAndMutations"
import { useGetCurrUser } from "@/lib/reactQuery/queriesAndMutations"
import { toast} from "@/components/ui/use-toast"
import { useEffect } from "react"
import { Url } from "url"
import { useNavigate } from "react-router-dom"

type PostFormProps = {
  post?: {
    caption: string,
    location?: string | undefined,
    tags?: string[] | undefined,
    file: string,
    imageUrl?: string | undefined,
    instructorId?: string;
    postId?: string, 
    imageId?: Url;
  }
  action: 'create' | 'update'
}

export const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const {mutateAsync: createPost} = useMakeNewPost();
  const {mutateAsync: updatePost} = useUpdatePost();
  const {mutateAsync: getCurrUser } = useGetCurrUser();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post? post.caption: '',
      file: [],
      location: post? post.location: '',
      tags: Array.isArray(post?.tags) ? post.tags.join(',') : '',
      imageUrl: post?.imageUrl || '', 
    } as {
      caption: string;
      file: File[];
      location: string;
      tags: string;
      imageUrl: string;
    },
  })

   async function onSubmit(values: z.infer<typeof PostValidation>) {
    if(post && action == 'update') {
      try{
        await updatePost({
          postId: post.instructorId as string,
          caption: values.caption,
          location: values.location,
          tags: [values.tags],
        })
        form.reset();
        toast({
          description: 'Update Successful'
        })
        navigate(`/posts/${post.instructorId}`);
      }catch(error){
        console.log(error);
      }
      return;
    }
    try{
      const currUser = await getCurrUser();
      if(currUser){
        console.log(values.file);
        await createPost({
          caption: values.caption,
          file: values.file,
          tags: [values.tags],
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

    useEffect(() => {
      form.reset({
        caption: post?.caption || '',
        location: post?.location || '',
        tags: Array.isArray(post?.tags) ? post.tags.join(',') : '',
        file: [],  // Assuming an array for 'file'
      });
    }, [post, form]);

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
                {...field}
                />
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
                  mediaUrl={post?.file} 
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
                {...field}
                placeholder="Add a location"
                />
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
                Add Tags seperated by (" , ")
                </FormLabel>
              <FormControl>
                < Input
                type="text"
                className=" h-[50px] bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[600px] rounded sm:w-[65%]"
                {...field}
                placeholder="People, Places, More"
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
            Submit
          </Button>
          <Button 
          type="submit"
          className=" bg-primary-500 hover:bg-primary-500 text-light-1 flex gap-2 h-12 sm:mr-20"
          >
            {post? 'Update Post': 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
