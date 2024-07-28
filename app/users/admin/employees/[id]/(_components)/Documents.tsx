import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Document = {
  id: string;
  url: string;
  userId: string;
};

export default function Documents() {
  const params = useParams();
  const [documents, setDocuments] = useState<[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/documents`);
        const data = res.data.filter((doc: Document) => doc.userId === params.id);
        const docs = data.map((doc:any) => doc.url);
        setDocuments(docs);
      } catch (error) {
        console.error('Failed to fetch documents', error);
      }
    };

    fetchData();
  }, [params.id]);


  return (
    <div>
      {documents.length > 0 ? ( documents.map((url,index) => (
        <div key={index} className="grid grid-cols-2 gap-x-8">
          {url ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-xl text-white">
                  Open Document/Image
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[80%]">
                <Image
                  src={url}
                  alt="image"
                  width={1000}
                  height={1000}
                  style={{ margin: "auto" }}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <p>No documents</p>
          )}
        </div>
      ))) : <p>No Documents available</p>}
    </div>
  );
}
