import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Unauthorized',
};
const Unauthorized = () => {
	return (
		<div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
			<h1 className="text-3xl font-bold">Unauthorized Access</h1>
			<p className="text-center text-lg text-muted-foreground">
				You do not have permission to view this page.
			</p>
			<Button asChild>
				<Link href="/">Return Home</Link>
			</Button>
		</div>
	);
};

export default Unauthorized;
