import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Job from "@/models/jobModel";


export async function GET() {
    await dbConnect();
    try {
        const jobs = await Job.find({});
        return NextResponse.json(jobs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();

        const { companyName, role, jobApplicationLink, dateApplied, priority, location, notes } = body;

        if (!companyName || !role || !dateApplied) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const lastJob = await Job.findOne({ status: "Applied" })
        .sort({ order: -1 })
        .select("order");

        const lastOrder = lastJob?.order ?? 0; 
        const newOrder = lastOrder + 1;
        console.log("New Job Order:", newOrder);
        const newJob = await Job.create({
            companyName,
            role,
            jobApplicationLink,
            dateApplied,
            priority: priority || "Medium",
            location: location || "Unknown",
            status: "Applied",
            lastStatusChange: new Date(),
            notes,
            order: newOrder,
        });
        console.log("Created Job:", newJob);
        
        return NextResponse.json({ job: newJob }, { status: 201 });
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }
}
