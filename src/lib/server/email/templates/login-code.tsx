import * as React from 'react'
import {
	Html,
	Head,
	Body,
	Container,
	Heading,
	Text,
	Section,
	Preview,
	Tailwind
} from '@react-email/components'

interface Options {
	code: string
	newAccount?: boolean
	maxAgeMins?: number
	expiresAtString: string
}

const LoginCodeEmail = ({ newAccount, code, maxAgeMins = 5, expiresAtString }: Options) => {
	const previewText = newAccount
		? 'finish creating your account'
		: 'securely log in to your account'
	const headingText = newAccount ? 'Create your account' : 'Log in to your account'
	const descriptiveText = newAccount ? 'activate account' : 'securely log in'

	return (
		<Html>
			<Preview>
				Here is your code to {previewText}. This code is available for {maxAgeMins} minutes
			</Preview>
			<Tailwind>
				<Head>
					<meta name="color-scheme" content="light dark" />
					<meta name="supported-color-schemes" content="light dark" />
				</Head>
				<Body className="bg-white pt-[50px] pb-[40px] font-sans dark:bg-neutral-900">
					<Container className="mx-auto max-w-[430px] px-1">
						<Heading className="m-0 pb-2 text-left text-[19px] font-[590] tracking-[-0.01em] text-neutral-800 dark:text-white">
							{headingText}
						</Heading>

						<Text className="m-0 mb-[32px] text-left text-[16px] tracking-[-0.01em] text-neutral-500 dark:text-neutral-400">
							Use the code below to {descriptiveText}
						</Text>

						<Section className="mt-10 mb-16">
							<div className="box-border h-[50px] w-full rounded-[14px] bg-neutral-100 px-[24px] py-[14px] text-center text-[24px] font-mono font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
								{code.substring(0, 3)} {code.substring(3, 6)}
							</div>
						</Section>

						<Text className="m-0 text-left text-[14px] leading-1 text-neutral-700 dark:text-neutral-200">
							This login code will be available for {maxAgeMins} minutes
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

export default LoginCodeEmail 