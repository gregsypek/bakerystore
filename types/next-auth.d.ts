import { DefaultSession } from "next-auth";

declare module 'next-auth' {
  export interface Session{
    user: {
      role: string;
    } & DefaultSession['user']
  }
}

// NOTE:
//Co robi declare module?
// declare module to tzw. module augmentation - sposób na "doklejenie" nowych typów do istniejącego modułu z biblioteki.
// Mówisz TypeScriptowi: "Hej, wiem że 'next-auth' już istnieje, ale chcę rozszerzyć interfejs Session o dodatkowe pole".

// Jak to działa?
// declare module 'next-auth' - otwierasz "przestrzeń" modułu next-auth
// export interface Session - rozszerzasz istniejący interfejs Session
// user: { role: string } & DefaultSession['user'] - bierzesz wszystkie domyślne pola z DefaultSession['user'] (name, email, image) i dodajesz role