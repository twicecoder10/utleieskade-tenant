import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

// Complete the auth session for web browser
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";

export interface OAuthUser {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  picture?: string;
  id?: string;
}

/**
 * Google OAuth Sign In
 * Note: This requires expo-auth-session package
 * Install with: npx expo install expo-auth-session
 */
export const signInWithGoogle = async (): Promise<OAuthUser | null> => {
  try {
    // Check if expo-auth-session is available
    let AuthSession;
    try {
      AuthSession = require("expo-auth-session");
    } catch (e) {
      console.warn("expo-auth-session not installed. Please run: npx expo install expo-auth-session");
      return null;
    }

    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "myapp",
      path: "oauth/google",
    });

    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    });

    const discovery = {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
      revocationEndpoint: "https://oauth2.googleapis.com/revoke",
    };

    const result = await request.promptAsync(discovery);

    if (result.type === "success") {
      const { access_token } = result.params;

      // Fetch user info from Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
      );
      const userInfo = await userInfoResponse.json();

      return {
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        name: userInfo.name,
        picture: userInfo.picture,
        id: userInfo.id,
      };
    }

    return null;
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return null;
  }
};

/**
 * Apple OAuth Sign In (iOS only)
 * Note: This requires expo-apple-authentication package
 * Install with: npx expo install expo-apple-authentication
 */
export const signInWithApple = async (): Promise<OAuthUser | null> => {
  if (Platform.OS !== "ios") {
    console.warn("Apple Sign In is only available on iOS");
    return null;
  }

  try {
    // Check if expo-apple-authentication is available
    let AppleAuthentication;
    try {
      AppleAuthentication = require("expo-apple-authentication");
    } catch (e) {
      console.warn("expo-apple-authentication not installed. Please run: npx expo install expo-apple-authentication");
      return null;
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (credential) {
      return {
        email: credential.email || "",
        firstName: credential.fullName?.givenName,
        lastName: credential.fullName?.familyName,
        name: credential.fullName
          ? `${credential.fullName.givenName || ""} ${credential.fullName.familyName || ""}`.trim()
          : undefined,
        id: credential.user,
      };
    }

    return null;
  } catch (error: any) {
    if (error.code === "ERR_REQUEST_CANCELED") {
      // User canceled the sign-in
      return null;
    }
    console.error("Apple OAuth Error:", error);
    return null;
  }
};

