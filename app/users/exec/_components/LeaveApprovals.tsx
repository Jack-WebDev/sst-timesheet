import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApproveTimesheet({ leaveRequest }: any) {
  const [comment, setComment] = useState<string>("");

  const handleApprove = async (id: string) => {
    await axios.put(`/api/leave/${id}`, {
      approvalStatus: `Approved`,
      comments: comment ? comment : "No comment",
    });
    window.location.reload();
  };

  const handleReject = async (id: string) => {
    await axios.put(`/api/leave/${id}`, {
      approvalStatus: `Rejected`,
      comments: comment ? comment : "No comment",
    });
    window.location.reload();
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <span className="cursor-pointer">
            <DotsHorizontalIcon className="h-4 w-4" />
          </span>
        </DialogTrigger>
        <DialogContent className="w-[70%] text-black">
          <DialogHeader className="flex flex-row items-baseline justify-around">
            <DialogTitle>
              Leave Request Details for :{" "}
              <span className="text-primary">{leaveRequest.fullName}</span>
            </DialogTitle>
          </DialogHeader>
          <div>
            <table className="generate w-full">
              <thead className="text-black">
                <tr>
                  <th>Leave Type</th>
                  <th>Date Requested</th>
                  <th>Request For</th>
                  {leaveRequest.requestFor === "Days" ? (
                    <th>Total Days</th>
                  ) : (
                    <th>Total Hours</th>
                  )}
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">{leaveRequest.leaveType}</td>
                  <td className="text-center">{leaveRequest.date}</td>
                  <td className="text-center">{leaveRequest.requestFor}</td>
                  {leaveRequest.requestFor === "Days" ? (
                    <td className="text-center">{leaveRequest.totalDays}</td>
                  ) : (
                    <td className="text-center">{leaveRequest.totalHours}</td>
                  )}

                  <td className="text-center">{leaveRequest.reason}</td>
                </tr>
              </tbody>
            </table>
            <hr className="bg-secondary h-[2px] w-full mt-12" />
            <div className="flex justify-around items-end gap-x-4 mt-4">
              <div className="grid comment">
                <label htmlFor="comment" className="mb-2">
                  Add comment:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="p-4 border border-black focus:outline-primary rounded-xl"
                  id="comment"
                ></textarea>
              </div>
              <div className="flex justify-end items-center gap-x-2">
                <Button
                  onClick={() => handleApprove(leaveRequest.id)}
                  className="bg-green-500 text-white rounded-xl hover:bg-green-400"
                >
                  <ThumbsUp color="white" className="mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(leaveRequest.id)}
                  className="bg-red-500 text-white rounded-xl hover:bg-red-400"
                >
                  <ThumbsDown color="white" className="mr-2" /> Reject
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
