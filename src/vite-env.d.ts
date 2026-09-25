/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  /** "false" hides the login page's Development accounts panel; anything else shows it. */
  readonly VITE_SHOW_DEV_ACCOUNTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
