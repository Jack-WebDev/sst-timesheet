import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/utils/uploadthing";
import axios from "axios";
import { revalidatePath } from "next/cache";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Document = {
  id: string;
  url: string;
  userId: string;
};

export default function Documents() {
  const params = useParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState<string[]>([]);


  useEffect(() => {
    fetch(`/api/documents`)
      .then((res) => res.json())
      .then((data) =>
        setDocuments(data.filter((doc: Document) => doc.userId === params.id))
      );
  }, [params.id]);

  // Handler for deleting a document
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});

  const handleDelete = async (id: any) => {
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [id]: true,
    }));
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== id)
        );

        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to delete the document", error);
    } finally {
      setLoadingMap((prevLoadingMap) => ({
        ...prevLoadingMap,
        [id]: false,
      }));
    }
  };

  const handleSubmit = async () => {
    const documentObjects = uploads.map((url) => ({
      url,
    }));

    const res = await axios.post(`/api/documents`, {
      url: documentObjects,
      userId: params.id,
    });
    window.location.reload();
  };

  return (
    <div>
      <div>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div key={doc.id} className="grid grid-cols-2 gap-x-8">
              {doc ? (
                <div className="flex items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="rounded-xl text-white">
                        Open Document/Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[80%]">
                      <Image
                        src={doc.url}
                        alt="image"
                        width={1000}
                        height={1000}
                        style={{ margin: "auto" }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={() => handleDelete(doc.id)}
                    disabled={loadingMap[doc.id]}
                    className="mt-2 rounded-xl text-white bg-red-500 hover:bg-red-600"
                  >
                    {loadingMap[doc.id] ? "Deleting..." : "Delete Document"}
                  </Button>
                </div>
              ) : (
                <p>No documents</p>
              )}
            </div>
          ))
        ) : (
          <p>No Documents available</p>
        )}
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="name" className="mb-1">
            Documents
          </Label>
          <UploadDropzone
            appearance={{
              label: "text-primary hover:text-secondary",
              button: "bg-primary text-white rounded-xl",
            }}
            className=" border border-primary rounded-xl cursor-pointer custom-class"
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              setUploads((prevDocs) => [...prevDocs, res[0].url.toString()]);
              toast.success("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              toast.error(`ERROR! ${error.message}`);
            }}
          />
        </div>

        {uploads.map((docs, index) => (
          <ol key={index} className="list-disc">
            <li className=" ml-8">{docs}</li>
          </ol>
        ))}

        <Button
          type="submit"
          className="rounded-xl text-white"
          onClick={handleSubmit}
        >
          Add Document
        </Button>
      </div>
    </div>
  );
}
