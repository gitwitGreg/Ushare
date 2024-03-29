import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { useForm} from "react-hook-form";
import { useSignInAccount } from '@/lib/reactQuery/queriesAndMutations';
import { INewUser } from '@/types';
import { toast} from "@/components/ui/use-toast"
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  async function onSubmit(data: INewUser) {
    try{
       await signInUser({
        email: data.email,
        password: data.password
      });
      toast({
        title: 'Sign In sucessful',
        description: 'User Logged in'
      })
      setIsLoading(true);
      reset();
      navigate('/')
    }catch(error){
      console.log(error);
      toast({
        description: 'User log in failed',
        variant: 'destructive'
      })
    }
  }


  const {mutateAsync: signInUser} = useSignInAccount();
  const { register, handleSubmit, reset} = useForm();
  return (
    <div className="sm:w-420 flex-center flex-col">
      <img 
      src="/assets/logo.png" 
      height={50} 
      width={50} 
      />
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Sign in
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        To use Ushare enter account details
      </p>

      <form 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-5 mt-2'>
        <label>Email</label>
        <input {...register('email')} 
        type='text'
        className='bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[500px] h-[50px] rounded'
        />
        <label>Password</label>
        <input {...register("password", 
        { required: true })} 
        type='password' 
        className='bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[500px] h-[50px] rounded'
        />   
        <Button 
        type='submit'
        className='shad-button_primary'>
          {isLoading ? (
            <div>
              <Loader />
            </div>
          ):'Sign in'}
        </Button>
          <p className=''>Dont have an account?
            <Link to='/sign-up' className='ml-1 text-primary-500'>
              Sign up
            </Link> 
          </p>
      </form>
    </div>
  )
}

export default SigninForm
