import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function Analytics() {
	const barChartData = [
		{ month: "NB3123", nitrogen: 24, phosporus: 32, potassium: 35 },
		{ month: "NB2123", nitrogen: 27, phosporus: 37, potassium: 49 },
		{ month: "NB1123", nitrogen: 31, phosporus: 24, potassium: 42 },
		{ month: "NB4123", nitrogen: 43, phosporus: 21, potassium: 32 },
		{ month: "NB5123", nitrogen: 35, phosporus: 30, potassium: 27 },
	]
	const pieChartData = [
		{ browser: "nitrogen", visitors: 275, fill: "var(--color-nitrogen)" },
		{ browser: "phosporus", visitors: 200, fill: "var(--color-phosporus)" },
		{ browser: "potassium", visitors: 187, fill: "var(--color-potassium)" },
	]

	const chartConfig = {
		nitrogen: {
			label: "nitrogen",
			color: "#624DE3",
		},
		phosporus: {
			label: "phosporus",
			color: "#00A7E1",
		},
		potassium: {
			label: "potassium",
			color: "#CD5C08",
		},
	}
	return (
		<section className='flex flex-col min-h-full h-auto w-3/4 m-auto rounded-xl justify-start items-center p-4 gap-2 text-black'>
			<h1 className='text-5xl font-bold'>Fertilizer Analytics</h1>
			<section className='flex flex-col justify-center lg:flex-row w-full h-full py-2 gap-2'>
				<div className="flex flex-col justify-start w-1/2">

					<h1 className="text-center text-2xl font-medium my-2 mx-auto">NPK Ratio Overview</h1>
					<h1 className="font-medium">Per Nutribin:</h1>
					<ChartContainer config={chartConfig} className="h-48 w-lg">
						<BarChart accessibilityLayer data={barChartData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="month"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey="nitrogen" fill="var(--color-nitrogen)" radius={4} />
							<Bar dataKey="phosporus" fill="var(--color-phosporus)" radius={4} />
							<Bar dataKey="potassium" fill="var(--color-potassium)" radius={4} />
						</BarChart>
					</ChartContainer>
					<Card className="flex flex-col text-black">
						<CardHeader className="items-center pb-0">
							<CardTitle>Pie Chart - Total NPK Nutrients</CardTitle>
							<CardDescription>January - June 2024</CardDescription>
						</CardHeader>
						<CardContent className="flex-1 pb-0">
							<ChartContainer
								config={chartConfig}
								className="[&_.recharts-pie-label-text]:fill-black mx-auto aspect-square h-64 pb-0"
							>
								<PieChart>
									<ChartTooltip content={<ChartTooltipContent hideLabel />} />
									<Pie data={pieChartData} dataKey="visitors" label nameKey="browser" />
								</PieChart>
							</ChartContainer>
						</CardContent>
						<CardFooter className="flex-col gap-2 text-sm">
							<div className="flex items-center gap-2 leading-none font-medium">
								Nitrogen being the most 5.3% more common<TrendingUp className="h-4 w-4" />
							</div>
							<div className="text-black leading-none">
								Showing total visitors for the last 6 months
							</div>
						</CardFooter>
					</Card>
				</div>
				<div className='flex lg:flex-col justify-center items-start h-full w-full lg:w-1/3 gap-2'>
					<h1 className="mx-auto text-2xl font-medium mb-4">Summary</h1>
					<h1 className="flex justify-center items-center rounded-full bg-secondary w-40 h-40 text-4xl font-medium text-white p-4 mx-auto">5</h1>
					<h1 className="mx-auto text-2xl font-medium">Machines</h1>
					<h1 className="flex justify-center items-center rounded-full bg-[#624DE3] w-40 h-40 text-4xl font-medium text-white p-4 mx-auto">15kg</h1>
					<h1 className="mx-auto text-2xl font-medium">Waste</h1>
					<h1 className="flex justify-center items-center rounded-full bg-secondary w-40 h-40 text-4xl font-medium text-white p-4 mx-auto">12.32kg</h1>
					<h1 className="mx-auto text-2xl font-medium">Fertilizer</h1>
				</div>
			</section>
		</section>
	)
}

export default Analytics
