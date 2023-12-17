import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id, //confirm we are member of this profile
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  //pick the first channel === general channel
  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  //mỗi khi user bấm vào 1 server thì mặc định ngay lập tức sẽ đến page của channel general
  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
