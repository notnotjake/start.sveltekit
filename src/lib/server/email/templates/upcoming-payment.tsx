import * as React from 'react'
import {
	Body,
	Preview,
	Container,
	Head,
	Link,
	Html,
	Section,
	Text,
	Row,
	Column,
	Tailwind,
	Hr
} from '@react-email/components'

const ConfirmChangeEmail = () => {
	return (
		<Html>
			<Preview>To update your email, confirm with the code</Preview>
			<Tailwind>
				<Head>
					<meta name="color-scheme" content="light dark" />
					<meta name="supported-color-schemes" content="light dark" />
				</Head>
				<Body className="bg-white pt-[20px] pb-[150px] font-sans dark:bg-neutral-900">
					<Container className="mx-auto max-w-[500px] px-1">
						<Section className="mb-8 text-neutral-800 dark:text-neutral-300">
							<Row>
								<Column>
									<Text className="text-[18px] font-semibold tracking-[-0.01em] text-neutral-800 dark:text-neutral-100">
										Upcoming Payment{' '}
										<span className="font-normal text-neutral-500 dark:text-neutral-400">
											to Light Dance
										</span>
									</Text>
								</Column>
								<Column>
									<Text className="my-1 w-fit rounded-md bg-slate-200 px-1.5 py-0 font-mono text-[14px] font-medium tracking-tight text-slate-800 dark:bg-slate-700 dark:text-slate-200">
										LF P6002
									</Text>
								</Column>
							</Row>
						</Section>
						<Section className="mb-16 w-full">
							<Text className="my-1 text-[15px] tracking-[-0.01em] text-neutral-800 dark:text-neutral-200">
								Next Tuesday <span className="text-neutral-500 dark:text-neutral-400">May 6th</span>
							</Text>
							<Text className="my-0 text-[16px] font-normal tracking-[-0.01em] text-neutral-800 dark:text-neutral-50">
								$450.00 will be charged to the card &bull;&bull;9945
							</Text>
						</Section>
						<Section className="mt-4 mb-0">
							<Text className="my-0 text-[14px] text-neutral-700 dark:text-neutral-300">
								Reply to this email with any questions or concerns
							</Text>
							<Text className="my-0 text-[14px]">
								<Link
									href="https://localhost:5173"
									className="m-0 text-left text-[14px] text-neutral-500 underline dark:text-neutral-400"
								>
									Update Payment Method
								</Link>
							</Text>
						</Section>
						<Hr className="mt-9 mb-0 border-neutral-300 dark:border-neutral-700" />
						<Section className="w-full">
							<Row className="mt-2 mb-3">
								<Column className="">
									<Text className="my-2 text-neutral-800 dark:text-neutral-100">
										3 Items{' '}
										<span className="text-neutral-500 dark:text-neutral-400">
											Landing Page for New Product
										</span>
									</Text>
								</Column>
								<Column className="">
									<Text className="my-2 text-right">
										<Link
											href="https://localhost:5173"
											className="m-0 text-left text-[14px] text-blue-600 underline dark:text-blue-500"
										>
											View Details
										</Link>
									</Text>
								</Column>
							</Row>
							<Row className="">
								<Column className="">
									<Text className="my-1 font-light text-neutral-700 dark:text-neutral-300">
										Web Design
									</Text>
								</Column>
								<Column className="text-right font-normal">
									<Text className="my-1 text-neutral-800 dark:text-neutral-200">$250</Text>
								</Column>
							</Row>
							<Row className="">
								<Column className="">
									<Text className="my-1 font-light text-neutral-700 dark:text-neutral-300">
										Hosting & Analytics
									</Text>
								</Column>
								<Column className="text-right font-normal">
									<Text className="my-1 text-neutral-800 dark:text-neutral-200">$50</Text>
								</Column>
							</Row>
							<Row className="">
								<Column className="">
									<Text className="my-1 font-light text-neutral-700 dark:text-neutral-300">
										Content Design & Publishing
									</Text>
								</Column>
								<Column className="text-right font-normal">
									<Text className="my-1 text-neutral-800 dark:text-neutral-200">$200</Text>
								</Column>
							</Row>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default ConfirmChangeEmail
