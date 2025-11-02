import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Job from "@/models/jobModel";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        status,
        lastStatusChange: new Date(),
      },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job: updatedJob }, { status: 200 });
  } catch (error) {
    console.error(" Error in updating the status:", error);
    return NextResponse.json({ error: "Failed to update job status" }, { status: 500 });
  }
}
