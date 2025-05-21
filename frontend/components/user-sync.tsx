"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Update the base URL to include the correct path prefix
const BACKEND_URL = "http://localhost:8000/api/v1/auth";

export function UserSync() {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      // Get the primary email address
      const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress || '';

      // Create user data object with default empty strings for null values
      const newUserData: UserData = {
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: primaryEmail
      };

      // Update state with user data
      setUserData(newUserData);

      console.log("this is the userData", userData);

      // Send data to backend
      const sendUserData = async () => {
        try {
          // Determine if this is a new registration or login
          const isNewUser = user.createdAt === user.updatedAt;
          const endpoint = isNewUser ? `${BACKEND_URL}/register` : `${BACKEND_URL}/login`;

          // Debug logs
          console.log('Is new user:', isNewUser);
          console.log('Full URL being called:', endpoint);
          console.log('Request payload:', newUserData);

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(newUserData),
          });

          console.log('Response status:', response.status);
          console.log('Response URL:', response.url);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }

          const data = await response.json();
          console.log('Backend response:', data);
        } catch (error) {
          console.error('Error sending user data to backend:', error);
          if (error instanceof Error) {
            console.error('Error details:', {
              message: error.message,
              stack: error.stack
            });
          }
        }
      };

      sendUserData();
    }
  }, [isLoaded, user, isSignedIn]);

  return null;
} 