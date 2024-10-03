import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const modelId = id;

      // Fetch the individual model by its ID
      const client = await clientPromise;
      const db = client.db("sd_model_new");

      // Find the model by ObjectId
      const model = await db.collection("lora_index").findOne({ _id: modelId });

      if (!model) {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
      }
      return NextResponse.json({ model });
    }
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const showHidden = searchParams.get("showHidden") || true;
    const showDownloaded = searchParams.get("showDownloaded") || true;
    const favOnly = searchParams.get("favOnly") || false;
    const sortOpt = searchParams.get("sortBy") || "published_date";
    const sortOrder = searchParams.get("order") || -1;
    const searchWords = searchParams.get("search") || "";
    const regexSearch = new RegExp(searchWords, "i");

    const showDownloadedFilter =
      showDownloaded === "true"
        ? { downloaded: { $in: [true, false] } }
        : { downloaded: { $ne: true } };

    const showHiddenFilter =
      showHidden === "true"
        ? { hidden: { $in: [true, false] } }
        : { hidden: { $ne: true } };

    const favOnlyFilter =
      favOnly === "true"
        ? { favourite: true }
        : { favourite: { $in: [true, false] } };

    const searchWordsFilter = {
      "$or": [
        { model_name: { $regex: regexSearch } },
        { model_version: { $regex:regexSearch } },
        { file_name: { $regex:regexSearch } },
        { author: { $regex:regexSearch } },
        { model_description: { $regex:regexSearch } },
        { version_description: { $regex:regexSearch } },
        { tags: { $regex:regexSearch } },
        { activation_text: { $regex:regexSearch } },
      ],
    };

    // Combine all filters into a single object
    let filterMap={};
    if(searchWords==="")
    {
      filterMap = {
        ...showDownloadedFilter,
        ...showHiddenFilter,
        ...favOnlyFilter,
      };
    }
    else
    {
      filterMap = {
        ...searchWordsFilter,
        ...showDownloadedFilter,
        ...showHiddenFilter,
        ...favOnlyFilter,
      };
    }
    const sortOptions = {};
    sortOptions[sortOpt] = sortOrder; // Dynamically set the sort field and order
    sortOptions["_id"] = -1; // Default secondary sorting by _id

    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("sd_model_new");

    const models = await db
      .collection("lora_index")
      .find(filterMap)
      .sort(sortOptions)
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
    console.log("PUTTING..");
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
