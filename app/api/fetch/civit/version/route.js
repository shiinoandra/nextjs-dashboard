import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  if(id!="")
  {
    try {
        const response = await fetch(
        "https://civitai.com/api/v1/model-versions/"+id
        );

        // Check if the response is ok
        if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Return the data as JSON
        return NextResponse.json(data);
    } catch (error) {
        // Return error response if fetching data fails
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
  else{
            return NextResponse.json({ message: "invalid ID format" }, { status: 500 });

  }

}
