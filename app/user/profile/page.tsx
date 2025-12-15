
import { auth } from '@/auth';
import { Metadata } from 'next';
import {SessionProvider} from 'next-auth/react';
import ProfileForm from './profile-form';


export const metadata: Metadata = {
  title: 'Customer Profile'
}
const Profile = async() => {
  const session = await auth();

// NOTE: Now the session provider is needed because our form is going to be a client component that's embedded
// in this profile page.
// And in a client component.
// You can't simply say session equals await auth.
// We have to use a hook called use session.
// And in order to use that use session hook, wherever that form is embedded, that client component,
// it has to be wrapped in the session provider.

  return ( <SessionProvider session={session}>
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="h2-bold">Profile</h2>
    <ProfileForm />
    </div>
  </SessionProvider> );
}
 
export default Profile;