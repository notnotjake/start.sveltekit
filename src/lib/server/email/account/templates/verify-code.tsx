import * as React from 'react'
import {
	Body,
	Preview,
	Container,
	Head,
	Html,
	Section,
	Text,
	Tailwind
} from '@react-email/components'

import { Expires } from '../components/expires'
import { HeaderGroup } from '../components/header-group'

type Options = {
	code: string
	maxAgeMins: string | number
	expiresAtString: string
}

const ConfirmChangeEmail = ({ code, maxAgeMins = 5, expiresAtString }: Options) => {
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
						<HeaderGroup headingText={headingText} descriptiveText={descriptiveText} />

						<Section className="mt-10 mb-16">
							<Text className="box-border h-[50px] w-full rounded-[14px] bg-neutral-100 px-[24px] py-[14px] text-center font-mono text-[16px] font-medium text-black dark:bg-neutral-800 dark:text-white">
								{code}
							</Text>
						</Section>

						<Expires maxAgeMins={maxAgeMins} expiresAtString={expiresAtString} />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default ConfirmChangeEmail
