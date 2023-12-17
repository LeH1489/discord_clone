import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "./db";

export const initialProfile = async () => {
  const user = await currentUser();

  //ko có user thì bắt login
  if (!user) {
    return redirectToSignIn();
  }

  //tìm profile connect tới user hiện tại
  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  //Nếu user hiện tại không có profile nào thì tạo mới
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
