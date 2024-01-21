import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useCallback, useEffect, useState} from 'react'
import {FileWithPath, useDropzone} from 'react-dropzone'
import { Button } from "../ui/button"


type FileUploaderProps= {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string | undefined  | File[];
}

const FileUploader = ({ fieldChange, mediaUrl}: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file,fieldChange]
  )

  useEffect(() => {
    setFileUrl(mediaUrl);
  }, [mediaUrl]);


  const {getRootProps, getInputProps} = useDropzone(
    {
      onDrop,
      accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.svg']
    }
  })


  return (
    <div className='mb-6 mr-72 justify-start'>
      <div className="file_uploader-box mt-6 w-full">
        <div 
        className="grid w-full max-w-sm items-center gap-1.5"
        {...getRootProps()}>
         <Label 
          htmlFor="picture"
          className=""
          >
            {
            fileUrl ? (
              <div className="flex justify-center w-[150%] p-5 lg:p-1">
                <img src={fileUrl as string}
                alt='image'
                className="file_uploader-img"
                width={96}
                height={77}
                />
              </div>
            ):(
              <div className="ml-28">
                <img 
                src='/assets/file-upload.svg'
                  />
                <h3 className="text-bold text-lg">Drag Photo</h3>
                <p className="text-light-4 small-regular mb-6">
                  SVG, PNG, JPEG 
                </p>
                <Button 
                className=" bg-dark-4 mt-2 w-full">
                  Select from Computer
                </Button>
              </div>
            )}
          </Label>
          <Input 
          id="picture" 
          type="file"
          className="border-none ml-2"
          {...getInputProps()} 
          />
        </div>
      </div>
    </div>
  )
}

export default FileUploader
