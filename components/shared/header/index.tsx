import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import Menu from './menu';
import CategoryDrawer from './category-drawer';

const Header = () => {
	return (
		<header className="w-full border-b">
			<div className="wrapper flex-between ">
				<div className="flex-start">
					<CategoryDrawer />
					<Link href="/" className="flex-start ml-4">
						{/* In Next.js, the priority tag in the Image component is used to enhance the loading behavior of images that are critical for the initial rendering of a page, ensuring they load as quickly as possible. */}
						<Image
							src="/images/logo.svg"
							alt={`${APP_NAME} logo`}
							height={48}
							width={48}
							priority={true}
							style={{ width: 'auto', height: '48px' }}
						/>
						<span className="hidden lg:block font-bold text-2xl ml-3">
							{APP_NAME}
						</span>
					</Link>
				</div>
				<Menu />
			</div>
		</header>
	);
};

export default Header;
