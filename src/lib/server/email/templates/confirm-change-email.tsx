import * as React from 'react'
import {
	Body,
	Preview,
	Container,
	Head,
	Heading,
	Html,
	Section,
	Text,
	Tailwind
} from '@react-email/components'

type Options = {
	code: string
	maxAgeMins: string | number
	expiresAtString: string
}
const ConfirmChangeEmail = ({ code, maxAgeMins, expiresAtString }: Options) => {
	return (
		<Html>
			<Preview>To update your email, confirm with the code {code}</Preview>
			<Tailwind>
				<Head>
					<meta name="color-scheme" content="light dark" />
					<meta name="supported-color-schemes" content="light dark" />
				</Head>
				<Body className="bg-white pt-[50px] pb-[40px] font-sans dark:bg-neutral-900">
					<Container className="mx-auto max-w-[430px] px-1">
						<Heading className="m-0 pb-2 text-left text-[19px] font-[590] tracking-[-0.01em] text-neutral-800 dark:text-white">
							Confirm New Email
						</Heading>

						<Text className="m-0 mb-[32px] text-left text-[16px] tracking-[-0.01em] text-neutral-500 dark:text-neutral-400">
							Use the code below to update your email
						</Text>

						<Section className="mt-10 mb-16">
							<Text className="box-border h-[50px] w-full rounded-[14px] bg-neutral-100 px-[24px] py-[14px] text-center font-mono text-[16px] font-medium text-black dark:bg-neutral-800 dark:text-white">
								{code}
							</Text>
						</Section>

						<Text className="m-0 text-left text-[14px] leading-1 text-neutral-700 dark:text-neutral-200">
							This code will be available for {maxAgeMins} minutes
						</Text>

						<Text className="m-0 text-left text-[14px] text-neutral-500 dark:text-neutral-400">
							Expires at {expiresAtString}
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default ConfirmChangeEmail
