/**
 * Type-safe internationalization declaration for next-intl.
 * Augments AppConfig to provide TypeScript autocompletion and
 * compile-time validation for all translation keys.
 */
import messages from "../../messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
  }
}
