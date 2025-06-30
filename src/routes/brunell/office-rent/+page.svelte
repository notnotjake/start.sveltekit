<script>
	// Cost items with their monthly values (using runes)
	let costs = $state([
		{
			name: 'Base Rent',
			description: 'Monthly rent payment',
			monthly: 1850,
			id: 'rent'
		},
		{
			name: 'Electricity',
			description: 'Electric utility costs',
			monthly: 500,
			id: 'electricity'
		},
		{
			name: 'Gas',
			description: 'Gas utility costs',
			monthly: 90,
			id: 'gas'
		},
		{
			name: 'Water',
			description: 'Water utility costs',
			monthly: 100,
			id: 'water'
		},
		{
			name: 'Internet',
			description: 'Internet service',
			monthly: 200,
			id: 'internet'
		},
		{
			name: 'Trash',
			description: 'Waste management',
			monthly: 0,
			id: 'trash'
		},
		{
			name: 'Property Taxes',
			description: 'Annual property taxes',
			monthly: 158.33, // 1900/12
			id: 'taxes'
		},
		{
			name: 'Interior Repairs',
			description: 'Maintenance and enhancements',
			monthly: 83.33, // 1000/12
			id: 'repairs'
		}
	])

	let tenantCount = $state(2)

	// Profit settings
	let profitType = $state('percent') // 'percent' or 'fixed'
	let profitPercent = $state(10)
	let profitFixed = $state(200)

	// Derived calculations
	const totalMonthlyCosts = $derived(costs.reduce((sum, cost) => sum + cost.monthly, 0))

	const costPerTenant = $derived(totalMonthlyCosts / tenantCount)

	const profitAmount = $derived(
		profitType === 'percent' ? (costPerTenant * profitPercent) / 100 : profitFixed / tenantCount
	)

	const finalPricePerTenant = $derived(costPerTenant + profitAmount)
	const yearlyProfitTotal = $derived(profitAmount * tenantCount * 12)

	// Update monthly value when yearly is changed
	function updateFromYearly(index, yearlyValue) {
		costs[index].monthly = yearlyValue / 12
	}

	// Update yearly value when monthly is changed
	function updateFromMonthly(index, monthlyValue) {
		costs[index].monthly = monthlyValue
	}

	// Format currency
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount)
	}

	// Format number with 2 decimal places
	const formatNumber = (amount) => {
		return Math.round(amount * 100) / 100
	}
</script>

<div class="min-h-screen bg-neutral-900 py-8 pt-18 text-white">
	<div class="mx-auto max-w-4xl px-4">
		<div class="overflow-hidden rounded-3xl bg-neutral-800">
			<!-- Header -->
			<div class="bg-green-600 px-6 py-8">
				<h1 class="text-2xl font-bold tracking-[-0.01em] text-white">Rent Calculator</h1>
				<p class="mt-1 font-medium tracking-[-0.01em] text-neutral-300">
					Calculate what to charge tenants based on your costs
				</p>
			</div>

			<div class="p-6">
				<div class="grid grid-cols-1 gap-8 xl:grid-cols-3">
					<!-- Cost Table Section -->
					<div class="xl:col-span-2">
						<!-- Tenant Count -->
						<div class="mt-6 flex items-baseline justify-between rounded-2xl bg-neutral-600 pl-5">
							<label class="mb-2 text-lg font-medium text-neutral-200"> Number of Tenants </label>
							<input
								bind:value={tenantCount}
								type="number"
								min="2"
								max="10"
								class="w-32 rounded-r-2xl px-4 py-3 text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
							/>
						</div>

						<!-- Profit Settings -->
						<div class="mt-6 flex min-h-14 items-center gap-2 rounded-2xl bg-neutral-600 pl-4">
							<h3 class="h-full text-lg font-medium text-neutral-300">Profit</h3>
							<div class="">
								<select bind:value={profitType} class="w-fit">
									<option value="percent">Percentage</option>
									<option value="fixed">Fixed Amount</option>
								</select>
							</div>

							<div class="grow"></div>

							{#if profitType === 'percent'}
								<div class="">
									<div class="relative">
										<input
											bind:value={profitPercent}
											type="number"
											min="0"
											step="0.5"
											class="h-full w-[8rem] rounded-r-2xl px-3 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
										/>
										<span class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500"
											>%</span
										>
									</div>
								</div>
							{:else}
								<div class="">
									<div class="relative">
										<span class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
											>$</span
										>
										<input
											bind:value={profitFixed}
											type="number"
											min="0"
											class="h-full w-[8rem] rounded-r-2xl pr-3 pl-8 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
										/>
									</div>
								</div>
							{/if}
						</div>

						<h2 class="mb-4 text-lg font-semibold text-neutral-200">Costs</h2>

						<div class="overflow-hidden rounded-t-xl rounded-b-xl bg-blue-500/20">
							<table class="w-full rounded-t-xl">
								<thead class=" bg-neutral-300">
									<tr>
										<th class="w-2/5 px-4 py-3 text-left text-sm font-medium text-gray-900">
											Item
										</th>
										<th class="w-1/3 px-4 py-3 text-left text-sm font-medium text-gray-900">
											Monthly
										</th>
										<th class="w-1/3 px-4 py-3 text-left text-sm font-medium text-gray-900">
											Yearly
										</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-neutral-200/20">
									{#each costs as cost, index}
										<tr class="hover:bg-blue-500/40">
											<td class="px-4 py-4">
												<div>
													<div class="font-medium text-neutral-100">{cost.name}</div>
													<div class="text-sm text-neutral-400">{cost.description}</div>
												</div>
											</td>
											<td class="px-4 py-4">
												<div class="relative">
													<span
														class="absolute top-1/2 left-3 -translate-y-1/2 transform text-neutral-300"
														>$</span
													>
													<input
														value={formatNumber(cost.monthly)}
														oninput={(e) =>
															updateFromMonthly(index, parseFloat(e.target.value) || 0)}
														type="number"
														step="0.01"
														class="w-full rounded-xl bg-neutral-100/20 py-2 pr-3 pl-8 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
													/>
												</div>
											</td>
											<td class="px-4 py-4">
												<div class="relative">
													<span
														class="absolute top-1/2 left-3 -translate-y-1/2 transform text-neutral-300"
														>$</span
													>
													<input
														value={formatNumber(cost.monthly * 12)}
														oninput={(e) =>
															updateFromYearly(index, parseFloat(e.target.value) || 0)}
														type="number"
														step="0.01"
														class="w-full rounded-xl bg-neutral-100/20 py-2 pr-3 pl-8 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
													/>
												</div>
											</td>
										</tr>
									{/each}
								</tbody>
								<tfoot class="bg-neutral-300">
									<tr>
										<td class="px-4 py-4 font-semibold text-gray-900"> Totals </td>
										<td class="px-4 py-4 text-lg font-bold text-gray-900">
											{formatCurrency(totalMonthlyCosts)}
										</td>
										<td class="px-4 py-4 text-lg font-bold text-gray-900">
											{formatCurrency(totalMonthlyCosts * 12)}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>

					<!-- Results Section -->
					<div class="space-y-6">
						<div>
							<h2 class="mb-4 text-lg font-semibold text-neutral-200">Pricing</h2>

							<!-- Summary Stats -->
							<div class="mb-3 rounded-2xl px-3 text-neutral-200">
								<h3 class="mb-3 font-semibold text-gray-300">Summary</h3>
								<div class="space-y-2 text-sm">
									<div class="flex justify-between">
										<span>Monthly Revenue:</span>
										<span class="font-medium"
											>{formatCurrency(finalPricePerTenant * tenantCount)}</span
										>
									</div>
									<div class="flex justify-between">
										<span>Monthly Costs:</span>
										<span class="font-medium">{formatCurrency(totalMonthlyCosts)}</span>
									</div>
									<div class="flex justify-between">
										<span>Monthly Profit:</span>
										<span class="font-medium text-green-500"
											>{formatCurrency(profitAmount * tenantCount)}</span
										>
									</div>
								</div>
							</div>

							<div class="space-y-4">
								<div class="rounded-2xl bg-neutral-700 p-4">
									<h3 class="font-semibold text-neutral-100">Cost Per Tenant</h3>
									<div class="text-2xl font-bold text-blue-400">
										{formatCurrency(costPerTenant)}
										<span class="text-sm font-normal">/month</span>
									</div>
									<p class="mt-1 text-sm font-medium text-neutral-200">
										Break-even price for {tenantCount} tenants
									</p>
								</div>

								<div class="rounded-2xl bg-neutral-700 p-4">
									<h3 class="font-semibold text-neutral-100">Final Price Per Tenant</h3>
									<div class="text-2xl font-bold text-green-400">
										{formatCurrency(finalPricePerTenant)}
										<span class="text-sm font-normal">/month</span>
									</div>
									<p class="mt-1 text-sm text-neutral-200">
										Including {profitType === 'percent'
											? `${profitPercent}% profit`
											: `${formatCurrency(profitFixed)} total profit`}
									</p>
								</div>

								<div class="rounded-2xl bg-neutral-700 p-4 text-neutral-200">
									<h3 class="font-semibold">Profit Per Tenant</h3>
									<div class="text-2xl font-bold text-yellow-400">
										{formatCurrency(profitAmount)}
										<span class="text-sm font-normal">/month</span>
									</div>
									<p class="mt-1 text-sm">Profit margin per tenant</p>
								</div>

								<div class="rounded-2xl bg-neutral-700 p-4 text-neutral-200">
									<h3 class="font-semibold">Annual Profit</h3>
									<div class="text-2xl font-bold text-purple-400">
										{formatCurrency(yearlyProfitTotal)}
										<span class="text-sm font-normal">/year</span>
									</div>
									<p class="mt-1 text-sm">Total yearly profit from all tenants</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	input[type='number'] {
		-moz-appearance: textfield;
	}
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
