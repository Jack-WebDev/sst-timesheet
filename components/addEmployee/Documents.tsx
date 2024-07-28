"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "../ui/button";
import { useEmployee } from "@/app/store";
import { createEmployee } from "@/actions/admin/employee/personalData";
import { useRouter } from "next/navigation";


export default function Documents() {
  const router = useRouter();
  const [documents, setDocuments] = useState<string[]>([]);

  const handleSubmit = async () => {
    const documentObjects = documents.map((url) => ({
      url,
    }));
  
    useEmployee.setState({ documents: documentObjects });
    const employeeData = sessionStorage.getItem("employee");
    if (employeeData) {
      const employee = JSON.parse(employeeData);
      createEmployee(employee.state);
      toast.success("Documents have been uploaded successfully.");
      router.replace("/users/admin/employees");
    }
    
  };

  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="name" className="mb-1">
          Documents
        </Label>
        <UploadDropzone
                  appearance={{
                    label:"text-primary hover:text-secondary",
                    button:"bg-primary text-white rounded-xl",
                  }}
          className=" border border-primary rounded-xl cursor-pointer custom-class"
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            setDocuments((prevDocs) => [...prevDocs, res[0].url]);
            toast.success("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            toast.error(`ERROR! ${error.message}`);
          }}
          />

      </div>



          {documents.map((docs,index) => (
            <ol key={index} className="list-disc">
              <li className=" ml-8">{docs}</li>
            </ol>
          ))}

          <Button type="submit" className="rounded-xl text-white" onClick={handleSubmit}>Submit</Button>
    </div>
  )
}