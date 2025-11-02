import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

import Job from "@/models/jobModel";


export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        await dbConnect();
        const job = await Job.findById(id);

        if (!job) {
            return NextResponse.json({ message: `Job not found for id ${id}` }, { status: 404 });
        }

        return NextResponse.json(job, { status: 200 });
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json({ message: "Error fetching job" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        await dbConnect();
        const deleatedJob = await Job.findByIdAndDelete(id);
        if (!deleatedJob) {
            return NextResponse.json({ message: `Job not found for id ${id}` }, { status: 404 });
        }
        return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });

    } catch (error) {
        console.log("Error deleting job:", error);
        return NextResponse.json({ message: "Error deleting job" }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        await dbConnect();
        const body = await request.json();
        const existingJob = await Job.findById(id);

        if (!existingJob) {
            return NextResponse.json({ error: `Job not found for id ${id}` }, { status: 404 });
        }

        const NonChangingFields = [
            "companyName",
            "role",
            "jobApplicationLink",
            "dateApplied",
        ];

        for (const field of NonChangingFields) {
            if (body[field] && body[field] !== existingJob[field]) {
                delete body[field];
            }
        }

        const updatedJob = await Job.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        return NextResponse.json({ job: updatedJob }, { status: 200 });


    } catch (error) {
        console.log("Error updating job:", error);
        return NextResponse.json({ message: "Error updating job" }, { status: 500 });
    }

}
