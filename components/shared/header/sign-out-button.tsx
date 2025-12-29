'use client';

import { signOutUser } from '@/lib/actions/user.actions';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTransition } from 'react';
import { Loader } from 'lucide-react';

export function SignOutButton() {
	const [isPending, startTransition] = useTransition(); //useTransition to React 18+ hook do obsługi asynchronicznych akcji bez blokowania UI:

	const handleSignOut = () => {
		startTransition(async () => {
			console.log('🚀 ~ Sign out button clicked');
			await signOutUser();
		});
	};

	return (
		<DropdownMenuItem
			onClick={handleSignOut}
			disabled={isPending}
			className="cursor-pointer"
		>
			{/* Loader because  Użytkownik może kliknąć wielokrotnie - now user see what's happenning*/}
			{isPending ? (
				<>
					<Loader className="mr-2 h-4 w-4 animate-spin" />
					Signing out...
				</>
			) : (
				'Sign Out'
			)}
		</DropdownMenuItem>
	);
}
