import PostForm from '@/components/forms/PostForm'

const CreatePost = () => {
  return (
    <div className='absolute top-32 left-[30%] sm:left-[35%]'>
      <div className='common-container'>
        <div className='max-w-5xl flex gap-3 justify-start w-full'>
          <img 
            src= '/assets/add-post.svg'
            width={36}
            height={36}
            alt= 'add post'
          />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Create Post</h2>
        </div>
        < PostForm action='create' />
      </div>
    </div>
  )
}

export default CreatePost
