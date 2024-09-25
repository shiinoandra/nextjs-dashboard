import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const showHidden = searchParams.get("showHidden") || true;
    const showDownloaded = searchParams.get("showDownloaded") || true;
    const favOnly = searchParams.get("favOnly") || false;



const showDownloadedFilter = (showDownloaded==='true') 
  ? { downloaded: { $in: [true, false] } }
  : { downloaded: { $ne: true } };

const showHiddenFilter = (showHidden === "true")
    ? { hidden: { $in: [true, false] } }
    : { hidden: { $ne: true } };

const favOnlyFilter = (favOnly === "true")
    ? { favourite: true }
    : { favourite: { $in: [true, false] } };

// Combine all filters into a single object
const filterMap = {
  ...showDownloadedFilter,
  ...showHiddenFilter,
  ...favOnlyFilter
};

    const skip = (page - 1) * limit;


    const client = await clientPromise;
    const db = client.db("sd_model_new");

    const models = await db
      .collection("lora_index")
      .find(filterMap)
      .sort({ published_date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await db
    .collection("lora_index")
    .find(filterMap)
    .count();
    const hasMore = skip + limit < totalCount;

    return NextResponse.json({
      models,
      hasMore,
      totalCount,
    });
  } catch (e) {
    console.error("API: Error fetching models:", e);
    return NextResponse.json(
      { error: "Unable to fetch models" },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db("sd_model_new");

    const { id, updatedData } = await request.json();

    const result = await db
      .collection("lora_index")
      .updateOne({ _id: id }, { $set: updatedData });
    console.log("PUTTING..")
    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Model updated successfully" });
    } else {
      return NextResponse.json(
        { message: "Model not found or not updated" },
        { status: 404 }
      );
    }
  } catch (e) {
    console.error("API: Error updating model:", e);
    return NextResponse.json(
      { error: "Unable to update model" },
      { status: 500 }
    );
  }
}