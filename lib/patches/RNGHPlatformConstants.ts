import { NativeModules, Platform } from "react-native";

type PlatformConstants = typeof Platform.constants & {
  forceTouchAvailable?: boolean;
};

function resolvePlatformConstants(): PlatformConstants {
  try {
    const nativeConstants = NativeModules?.PlatformConstants as PlatformConstants | undefined;
    if (nativeConstants != null) {
      return nativeConstants;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[RNGH] Failed to access NativeModules.PlatformConstants. Falling back to Platform.constants.",
        error,
      );
    }
  }

  return Platform.constants as PlatformConstants;
}

const platformConstants = resolvePlatformConstants();

export default platformConstants;
