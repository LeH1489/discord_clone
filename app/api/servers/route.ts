import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

//create a new server
export async function POST(req: Request) {
  try {
    //get data from request
    const { name, imageUrl } = await req.json();

    //get current profile of current user
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name: name,
        imageUrl: imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN, //initial member who created  this server is gonna be the admin
            },
          ],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
