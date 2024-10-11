import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // missing_hash : null hash, "null" hash or "" hash possibly hash is not yet calculated when uploaded to civit or
    // its from file that is no longer exist so no way to know it original hash listed in civit

    // mismatch_hash : hash proved in civit does not correspond with calculated hash from local file, might be because of file corruption partial download or error on the civit side

    // missing_creator : null creator, "null" creator or "" creator, possibly creator is deleted from civit
    // missing_preview : missing .png preview image that should have been downloaded along with json and safetensor file, mostly because of error in downloading process

    // missing_model : info downloaded but .safetensors does not exist, either error when downloading early access model or moved file or corrupted and error when downloading

    // missing_json: missing json file that should have been created when downloading the model, mostly because of error in code , force exit, or deleted/moved json
    // missing_html: missing html file that should have been created when downloading the model, mostly because of error in code , force exit, or deleted/moved json

    // missing_integrity: integrity field does not exist, probably newer file where integrity check is not performed yet

    // missing model_id or version_id : downloaded model from sources other than civit and model that is downloaded and later deleted from civit before the information could be retrieved

    const client = await clientPromise;
    const db = client.db("sd_model_new");
    let issue_data ="invalid type";
    if (type === "missing_hash") {
      issue_data = await db
        .collection("lora")
        .find({
          $or: [{ file_hash: "" }, { file_hash: null }, { file_hash: "null" }],
        })
        .toArray();
    } else if (type === "mismatch_hash") {
      issue_data = await db
        .collection("lora")
        .find({
          $or: [{ hash_match: false }, { hash_match: { $exists: false } }],
        })
        .toArray();
    } else if (type === "missing_creator") {
      issue_data = await db
        .collection("lora")
        .find({
          $or: [
            { model_author: "" },
            { model_author: null },
            { model_author: "null" },
          ],
        })
        .toArray();
    } else if (type === "missing_preview") {
      issue_data = await db
        .collection("lora")
        .find({
          $or: [
            { preview_path: "" },
            { preview_path: null },
            { preview_path: "null" },
            // { preview_exist: false },
          ],
        })
        .toArray();
    } else if (type === "missing_model") {
      issue_data = await db
        .collection("lora")
        .find({
          $or: [
            { model_path: "" },
            { model_path: null },
            { model_path: "null" },
            // { model_exist: false },
          ],
        })
        .toArray();
    } else if (type === "missing_json") {
      issue_data = await db
        .collection("lora")
        .find({
          $or: [
            { json_path: "" },
            { json_path: null },
            { json_path: "null" },
            // { json_exist: false },
          ],
        })
        .toArray();
    } else if (type === "missing_html") {
      issue_data = await db
        .collection("lora")
        .find({
          $or: [
            { html_path: "" },
            { html_path: null },
            { html_path: "null" },
            // { html_exist: false },
          ],
        })
        .toArray();
    } else if (type === "missing_integrity") {
      issue_data = await db
        .collection("lora")
        .find({
          $or: [
            { hash_match: { $exists: false } },
            { last_integrity_check: { $exists: false } },
          ],
        })
        .toArray();
    } else if (type === "missing_id") {
      issue_data = await db
        .collection("lora")
        .find({
          $or: [
            { model_id: "" },
            { model_id: null },
            { model_id: "null" },
            { model_version_id: "" },
            { model_version_id: null },
            { model_version_id: "null" },
          ],
        })
        .toArray();
    }
    return NextResponse.json({data:issue_data,count:issue_data.length});

  }
  catch (e) {
    console.error("API: Error fetching models:", e);
    return NextResponse.json(
      { error: "Unable to fetch queue" },
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
      .collection("lora")
      .updateOne({ _id: id }, { $set: updatedData });
    console.log("PUTTING..");
    console.log(result);
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
