import { auth } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";

// Server-side function to get user info
export async function getAuthUser() {
  const { userId, sessionId, getToken } = await auth();
  
  if (!userId) {
    return null;
  }

  return {
    userId,
    sessionId,
    token: await getToken(),
  };
}

// Client-side hook to get user info
export function useAuthUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return {
    userId: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  };
} 