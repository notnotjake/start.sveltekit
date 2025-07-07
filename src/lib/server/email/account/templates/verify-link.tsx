import * as React from 'react'
import {
	Body,
	Button,
	Preview,
	Container,
	Head,
	Html,
	Section,
	Tailwind
} from '@react-email/components'

import { Expires } from '../components/expires'
import { HeaderGroup } from '../components/header-group'

type Options = {
	newAccount: boolean
	url: string
	maxAgeMins: string | number
	expiresAtString: string
}

const MagicLinkEmail = ({ newAccount, url, maxAgeMins = 5, expiresAtString }: Options) => {
	const previewText = newAccount
		? 'finish creating your account'
		: 'securely log in to your account'
	const headingText = newAccount ? 'Create your account' : 'Log in to your account'
	const descriptiveText = newAccount ? 'activate account' : 'securely log in'

	return (
		<Html>
			<Preview>
				Here is your link to {previewText}. This link is available for {maxAgeMins.toString()}{' '}
				minutes
			</Preview>
			<Tailwind>
				<Head>
					<meta name="color-scheme" content="light dark" />
					<meta name="supported-color-schemes" content="light dark" />
				</Head>
				<Body className="bg-white pt-[50px] pb-[40px] font-sans dark:bg-neutral-900">
					<Container className="mx-auto max-w-[430px] px-1">
						<HeaderGroup headingText={headingText} descriptiveText={descriptiveText} />

						<Section className="mt-10 mb-16">
							<Button
								className="box-border h-[50px] w-full rounded-[14px] bg-black px-[24px] py-[14px] text-center text-[16px] font-medium text-white dark:bg-neutral-50 dark:text-black"
								href={url}
							>
								Click to Sign In
							</Button>
						</Section>

						<Expires maxAgeMins={maxAgeMins} expiresAtString={expiresAtString} />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default MagicLinkEmail
