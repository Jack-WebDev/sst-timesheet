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
import { useUser } from "@/app/store";
import { Button } from "../ui/button";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";

export default function ApproveTimesheet({ timesheet }: any) {
  const [comment, setComment] = useState<string>("");
  const userZ = useUser();

  const handleApprove = async (id: string) => {
    const res = await axios.put(`/api/timesheets/${id}`, {
      Approval_Status: `Approved by ${userZ.Name} ${userZ.Surname}, pending executive approval`,
      comment: comment,
    });
    window.location.reload();
  };

  const handleReject = async (id: string) => {
    await axios.put(`/api/timesheets/${id}`, {
      Approval_Status: `Rejected by ${userZ.Name} ${userZ.Surname}, pending executive approval;`,
      comment: comment,
    });
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer">
          <DotsHorizontalIcon className="h-4 w-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="w-[50%]">
        <DialogHeader>
          <DialogTitle className="flex justify-around items-center text-2xl">
            Name: {timesheet.name}
            <span className="text-xl">
              Weekly Period:{" "}
              <b className="text-primary">{timesheet.weeklyPeriod}</b>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div>
          <table className="w-full">
            <thead>
              <tr>
                <th>Weekday</th>
                <th>Type Of Day</th>
                <th>Total Time</th>
                <th>Tasks Performed</th>
                <th>Task Status</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {timesheet &&
                timesheet.tableRows &&
                timesheet.tableRows?.map((r: any) => (
                  <tr
                    key={r.id}
                    className="text-center border-b border-secondary"
                  >
                    <td>
                      <p>{r.weekday}</p>
                    </td>
                    <td>
                      <p>{r.typeOfDay === "" ? "N/A" : r.typeOfDay}</p>
                    </td>

                    <td>
                      <p>{`${r.totalHours} hrs ${r.totalMinutes} mins`}</p>
                    </td>
                    <td className="text-center">
                      {r.tasks && r.tasks.length > 0 ? (
                        r.tasks.map((t: any) => (
                          <div key={t.id}>
                            <p>
                              {t.taskPerformed === "" ? "N/A" : t.taskPerformed}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>N/A</p>
                      )}
                    </td>

                    <td className="text-center">
                      {r.tasks && r.tasks.length > 0 ? (
                        r.tasks.map((t: any) => (
                          <div key={t.id}>
                            <p>{t.taskStatus}</p>
                          </div>
                        ))
                      ) : (
                        <span>N/A</span>
                      )}
                    </td>
                    <td className="text-center">
                      <p>{r.comment === "" ? "N/A" : r.comment}</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="flex justify-evenly items-end mt-4 approval_process">
            <div className="grid comment">
              <label htmlFor="comment" className="mb-2">
                Add comment:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="px-4 border border-black focus:outline-primary rounded-xl"
                id="comment"
              ></textarea>
            </div>
            <div className="btns flex items-end gap-x-4 justify-items-end">
              <Button
                onClick={() => handleApprove(timesheet.id)}
                className="bg-green-500 text-white rounded-xl hover:bg-green-400"
              >
                <FaThumbsUp color="white" className="mr-2" /> Approve
              </Button>
              <Button
                onClick={() => handleReject(timesheet.id)}
                className="bg-red-500 text-white rounded-xl hover:bg-red-400"
              >
                <FaThumbsDown color="white" className="mr-2" /> Reject
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
