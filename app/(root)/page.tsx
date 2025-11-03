import { Button } from "@/components/ui/button";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

import sampleData from "./db/sample-data";
import ProductList from "@/components/shared/product/product-list";

const HomePage = async () => {
	// await delay(2000);
	console.log("🚀 ~ sampleData:", sampleData);

	return (
		<>
			<ProductList
				data={sampleData.products}
				title="Newest Arrivals"
				limit={4}
			/>
		</>
	);
};

export default HomePage;
