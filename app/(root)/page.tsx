// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// import sampleData from "../../db/sample-data";
import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';

const HomePage = async () => {
	const latestProducts = await getLatestProducts();
	// await delay(2000);
	// console.log("🚀 ~ sampleData:", sampleData);

	return (
		<>
			<ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
		</>
	);
};

export default HomePage;
