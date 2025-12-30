// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// import sampleData from "../../db/sample-data";
import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import ViewAllProductsButton from '@/components/view-all-products-button';
import {
	getFeaturedProducts,
	getLatestProducts,
} from '@/lib/actions/product.actions';

const HomePage = async () => {
	const latestProducts = await getLatestProducts();
	const featuredProducts = await getFeaturedProducts();
	// await delay(2000);
	// console.log("🚀 ~ sampleData:", sampleData);

	return (
		<>
			{featuredProducts.length > 0 && (
				<ProductCarousel data={featuredProducts} />
			)}
			<ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
			<ViewAllProductsButton />
		</>
	);
};

export default HomePage;
