import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import userSWR from "swr";

export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const mode = searchParams.get("mode") || "min";
      handleGetQueue(request,searchParams);
      const client = await clientPromise;
      const db = client.db("sd_model_new");
      let queue;
      if (mode ==="min")
      {
      queue = await db
        .collection("lora_index")
        .find({$or:[{flag:"dl"},{flag:"que"}]})
        .project({ _id: 1, model_id: 1, version_id: 1, flag: 1 })
        .toArray();
      }
      else{
        queue = await db
          .collection("lora_index")
          .find({ flag: { $ne: "" } })
          .toArray();
      }
;

      return NextResponse.json({ queue });
    } catch (e) {
      console.error("API: Error fetching models:", e);
      return NextResponse.json(
        { error: "Unable to fetch queue" },
        { status: 500 }
      );
    }
}

async function handleGetQueue(request, searchParams) {
  try {
    const client = await clientPromise;
    const db = client.db("sd_model_new");

    const queue = await db
      .collection("lora_index")
      .find({flag:{$ne:""}})
      .toArray();

    return NextResponse.json({ queue });
  } catch (e) {
    console.error("API: Error fetching queue:", e);
    return NextResponse.json(
      { error: "Unable to fetch queue" },
      { status: 500 }
    );
  }
}

