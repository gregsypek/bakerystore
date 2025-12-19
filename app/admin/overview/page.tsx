import { auth } from "@/auth";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { Metadata } from "next";

export const metadat: Metadata = {
	title: "Admin Dashboard",
};
const AdminOverviewPage = async () => {
	const session = await auth();

	if (session?.user?.role !== "admin") {
		throw new Error("User is not authorized");
	}

	const summary = await getOrderSummary();
	console.log("🚀 ~ AdminOverviewPage ~ summary:", summary);
	return <>Overview</>;
};

export default AdminOverviewPage;
