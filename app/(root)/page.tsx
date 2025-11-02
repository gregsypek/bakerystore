import { Button } from "@/components/ui/button";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
	await delay(2000);
	return (
		<>
			<h1 className="my-9">hello</h1>
			<Button className="destructive">buttodn</Button>
		</>
	);
};

export default HomePage;
