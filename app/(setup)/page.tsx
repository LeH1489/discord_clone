import InitialModal from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  //gọi custom lib để (lấy profile của user hiện tại nếu có || tạo profile mới nếu chưa có)
  const profile = await initialProfile();

  //load server
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id, //this profile of current user is a member of this server ==> load server
        },
      },
    },
  });

  //if server is existing
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  //if user is not a member of any server then create a server
  return <InitialModal />;
};

export default SetupPage;
