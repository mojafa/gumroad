import * as React from "react";

import { getContrastColor, getDarkModeBackground, hexToRgb } from "$app/utils/color";

const PROFILE_THEME_ID = "profile-theme-provider";

type ProfileSettings = {
  background_color: string;
  highlight_color: string;
  font?: string;
};

/**
 * Applies the creator's chosen profile colors with light/dark variants.
 * Respects user's prefers-color-scheme so dark mode users see a darkened variant.
 * Fixes issue #3738: profile theme overrides user dark mode preference.
 */
export const ProfileThemeProvider = ({
  profileSettings,
  children,
}: {
  profileSettings: ProfileSettings;
  children: React.ReactNode;
}) => {
  const css = React.useMemo(() => {
    const lightBg = profileSettings.background_color;
    const darkBg = getDarkModeBackground(profileSettings.background_color);
    const lightColor = getContrastColor(lightBg);
    const darkColor = getContrastColor(darkBg);
    const accentRgb = hexToRgb(profileSettings.highlight_color);
    const contrastAccentRgb = hexToRgb(getContrastColor(profileSettings.highlight_color));

    return `
      /* Default/fallback: light mode (no-preference, or older browsers) */
      [data-profile-theme] {
        --accent: ${accentRgb};
        --contrast-accent: ${contrastAccentRgb};
        --filled: ${hexToRgb(lightBg)};
        --color: ${hexToRgb(lightColor)};
        --primary: var(--color);
        --body-bg: rgb(${hexToRgb(lightBg)});
        --contrast-primary: ${hexToRgb(lightBg)};
        --contrast-filled: ${hexToRgb(lightColor)};
        --border-alpha: 1;
        --color-body: rgb(${hexToRgb(lightBg)});
        --color-background: rgb(${hexToRgb(lightBg)});
        --color-foreground: rgb(${hexToRgb(lightColor)});
        --color-border: rgb(${hexToRgb(lightColor)} / 1);
        --color-accent: rgb(${accentRgb});
        --color-accent-foreground: rgb(${contrastAccentRgb});
        --color-primary: rgb(var(--primary));
        --color-primary-foreground: rgb(${hexToRgb(lightBg)});
        --color-active-bg: rgb(${hexToRgb(lightColor)} / var(--gray-1));
        --color-muted: rgb(${hexToRgb(lightColor)} / var(--gray-3));
        background-color: rgb(${hexToRgb(lightBg)}) !important;
        color: rgb(${hexToRgb(lightColor)}) !important;
      }
      @media (prefers-color-scheme: light) {
        [data-profile-theme] {
          --accent: ${accentRgb};
          --contrast-accent: ${contrastAccentRgb};
          --filled: ${hexToRgb(lightBg)};
          --color: ${hexToRgb(lightColor)};
          --primary: var(--color);
          --body-bg: rgb(${hexToRgb(lightBg)});
          --contrast-primary: ${hexToRgb(lightBg)};
          --contrast-filled: ${hexToRgb(lightColor)};
          --border-alpha: 1;
          --color-body: rgb(${hexToRgb(lightBg)});
          --color-background: rgb(${hexToRgb(lightBg)});
          --color-foreground: rgb(${hexToRgb(lightColor)});
          --color-border: rgb(${hexToRgb(lightColor)} / 1);
          --color-accent: rgb(${accentRgb});
          --color-accent-foreground: rgb(${contrastAccentRgb});
          --color-primary: rgb(var(--primary));
          --color-primary-foreground: rgb(${hexToRgb(lightBg)});
          --color-active-bg: rgb(${hexToRgb(lightColor)} / var(--gray-1));
          --color-muted: rgb(${hexToRgb(lightColor)} / var(--gray-3));
          background-color: rgb(${hexToRgb(lightBg)}) !important;
          color: rgb(${hexToRgb(lightColor)}) !important;
        }
      }
      @media (prefers-color-scheme: dark) {
        [data-profile-theme] {
          --accent: ${accentRgb};
          --contrast-accent: ${contrastAccentRgb};
          --filled: ${hexToRgb(darkBg)};
          --color: ${hexToRgb(darkColor)};
          --primary: var(--color);
          --body-bg: rgb(${hexToRgb(darkBg)});
          --contrast-primary: ${hexToRgb(darkBg)};
          --contrast-filled: ${hexToRgb(darkColor)};
          --border-alpha: 0.35;
          --color-body: rgb(${hexToRgb(darkBg)});
          --color-background: rgb(${hexToRgb(darkBg)});
          --color-foreground: rgb(${hexToRgb(darkColor)});
          --color-border: rgb(${hexToRgb(darkColor)} / 0.35);
          --color-accent: rgb(${accentRgb});
          --color-accent-foreground: rgb(${contrastAccentRgb});
          --color-primary: rgb(var(--primary));
          --color-primary-foreground: rgb(${hexToRgb(darkBg)});
          --color-active-bg: rgb(${hexToRgb(darkColor)} / var(--gray-1));
          --color-muted: rgb(${hexToRgb(darkColor)} / var(--gray-3));
          background-color: rgb(${hexToRgb(darkBg)}) !important;
          color: rgb(${hexToRgb(darkColor)}) !important;
        }
      }
    `;
  }, [profileSettings.background_color, profileSettings.highlight_color, profileSettings.font]);

  React.useEffect(() => {
    let el = document.getElementById(PROFILE_THEME_ID) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = PROFILE_THEME_ID;
      el.setAttribute("data-profile-theme-styles", "true");
      document.head.appendChild(el);
    }
    el.textContent = css;
    return () => {
      el?.remove();
    };
  }, [css]);

  return (
    <div data-profile-theme style={{ fontFamily: profileSettings.font && profileSettings.font !== "ABC Favorit" ? profileSettings.font : undefined }}>
      {children}
    </div>
  );
};
