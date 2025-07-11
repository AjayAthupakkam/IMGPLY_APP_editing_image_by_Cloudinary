import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ 
      success: true, 
      message: "MongoDB connection successful" 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "MongoDB connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 