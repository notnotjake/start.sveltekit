import * as React from 'react'
import {
	Body,
	Preview,
	Container,
	Head,
	Heading,
	Html,
	Text,
	Tailwind
} from '@react-email/components'

const AlertChangeEmail = ({ newEmail }: { newEmail: string }) => {
	return (
		<Html>
			<Preview>Your account's email has been updated</Preview>
			<Tailwind>
				<Head>
					<meta name="color-scheme" content="light dark" />
					<meta name="supported-color-schemes" content="light dark" />
				</Head>
				<Body className="bg-white pt-[50px] pb-[40px] font-sans dark:bg-neutral-900">
					<Container className="mx-auto max-w-[430px] px-1">
						<Heading className="m-0 pb-2 text-left text-[19px] font-[590] tracking-[-0.01em] text-neutral-800 dark:text-white">
							Your email has been successfully updated
						</Heading>

						<Text className="m-0 mb-[32px] text-left text-[16px] tracking-[-0.01em] text-neutral-500 dark:text-neutral-400">
							Your accounts email has been updated to {newEmail}
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default AlertChangeEmail
