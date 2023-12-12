import { Button } from '@/components/ui/button';
import { useForm} from "react-hook-form";
import { INewUser } from '@/types';
import Loader from '@/components/shared/Loader';
import "firebase/compat/auth";
import { toast} from "@/components/ui/use-toast"
import { Link, useNavigate } from 'react-router-dom';
import { useAddAccount, useCreateUserAccount, useSignInAccount } from '@/lib/reactQuery/queriesAndMutations';



export const SignupForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset} = useForm();
  const {mutateAsync: postingUser} = useCreateUserAccount();
  const {mutateAsync: signInUser} = useSignInAccount();
  const {mutateAsync: addAccount, isPaused: isAddingAccount } = useAddAccount();

   
  async function onSubmit(data: INewUser) {
    try{
       await postingUser(data)
       await signInUser({
        email: data.email,
        password: data.password,
      });
       await addAccount(data);
      toast({
        title: 'Sign up sucessful',
        description: 'User loged in'
      })
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
  return (
    <div className="sm:w-420 flex-center flex-col">
      <img 
      src="/assets/logo.png" 
      height={50} 
      width={50} 
      />
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
        Create a new account
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        To use Ushare enter account details
      </p>

      <form 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-5 mt-2'>
        <label>Username</label>
        <input {...register('username')} 
        type='text'
        className='bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[500px] h-[50px] rounded'
        />
        <label>Password</label>
        <input {...register("password", 
        { required: true })} 
        type='password' 
        className='bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[500px] h-[50px] rounded'
        />   
        <label>Email</label>
        <input {...register('email')} type="text" 
        className='bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important w-[500px] h-[50px] rounded'
        />
        <Button 
        type='submit'
        className='shad-button_primary'>
          {isAddingAccount ? (
            <div>
              <Loader />
            </div>
          ):'Sign up'}
        </Button>
        <p className=''>Already have an account?
          <Link to='/sign-in' className='ml-1 text-primary-500'>
            Sign in
          </Link> 
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
