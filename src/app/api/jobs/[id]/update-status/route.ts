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
    const { status, order } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    let newOrder = order;

    if (newOrder === undefined) {
      const lastJob = await Job.findOne({ status })
        .sort({ order: -1 })
        .select("order");

      newOrder = lastJob ? lastJob.order + 1000 : 1000;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        status,
        order: newOrder,
        lastStatusChange: new Date(),
      },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job: updatedJob }, { status: 200 });
  } catch (error) {
    console.error("Error updating job status:", error);
    return NextResponse.json(
      { error: "Failed to update job status" },
      { status: 500 }
    );
  }
}
