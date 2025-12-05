"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const PaymentMethodForm = ({
	preferredPaymentMethod,
}: {
	preferredPaymentMethod: string | null;
}) => {
	const form = useForm<z.infer<typeof paymentMethodSchema>>({
		resolver: zodResolver(paymentMethodSchema),
		defaultValues: {
			type: preferredPaymentMethod ?? DEFAULT_PAYMENT_METHOD,
		},
	});

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
		startTransition(async () => {
			const res = await updateUserPaymentMethod(values);
			console.log("Selected payment method:", values);
			if (!res.success) {
				toast.error(res.message);
				return;
			}
			router.push("/place-order");
		});
	};

	return (
		<div className="max-w-md mx-auto space-y-6 py-8">
			<div>
				<h1 className="text-2xl font-bold">Payment Method</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Please select a payment method.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem className="space-y-4">
								<FormLabel>Choose payment method</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex flex-col space-y-3"
									>
										{PAYMENT_METHODS.map((method) => (
											<FormItem
												key={method}
												className="flex items-center space-x-3 space-y-0"
											>
												<FormControl>
													<RadioGroupItem value={method} />
												</FormControl>
												<FormLabel className="font-normal cursor-pointer">
													{method}
												</FormLabel>
											</FormItem>
										))}
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						disabled={isPending}
						className="w-full md:w-auto"
					>
						{isPending ? (
							<>
								<Loader className="mr-2 h-4 w-4 animate-spin" />
								Processing...
							</>
						) : (
							<>
								Continue
								<ArrowRight className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default PaymentMethodForm;
