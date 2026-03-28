import { clerkClient } from "../lib/clerkClient.js";

export const getUserEmail = async (userId: string) => {
  try {
    const user = await clerkClient.users.getUser(userId);

    const email = user.emailAddresses.find(
      e => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    return email || null;
  } catch (err) {
    console.error("Failed to fetch Clerk email:", err);
    return null;
  }
};
