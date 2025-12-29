"use client";

import { usePathname, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const AdminSearch = () => {
	const pathname = usePathname();
	const formActionUrl = pathname.includes("/admin/orders")
		? "/admin/orders"
		: pathname.includes("/admin/users")
			? "/admin/users"
			: "/admin/products";

	const searchParams = useSearchParams();
	// Derive the value directly from searchParams - no state needed!
	const queryValue = searchParams.get("query") || "";

	//NOTE: BAD APPROACH (COMMENTED) - creates unnecessary re-renders (cascading renders) since searchParams changes trigger the effect, which then triggers a state update.
	// const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");
	// useEffect(() => {
	// 	setQueryValue(searchParams.get("query") || "");
	// }, [searchParams]);

	return (
		<form action={formActionUrl} method="GET">
			<Input
				type="search"
				placeholder="Search..."
				name="query"
				// value={queryValue}
				// onChange={(e) => setQueryValue(e.target.value)}
				defaultValue={queryValue} //NOTE: The queryValue is now computed directly from searchParams on each render
				className="md:w-[100px] lg:w-[300px]"
			/>
			<button className="sr-only" type="submit">
				Search
			</button>
		</form>
	);
};

export default AdminSearch;
