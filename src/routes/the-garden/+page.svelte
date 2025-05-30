<script lang="ts">
	import '@fontsource/libre-baskerville/400.css'
	import '@fontsource/libre-baskerville/700.css'
	import { onMount } from 'svelte'
	import { gsap } from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger)
	})
</script>

<svelte:head>
	<meta name="theme-color" content="#000000" />
</svelte:head>

<!-- Fixed header section that scrolls off the top -->
<div class="fixed inset-0 z-20 bg-black">
	<div class="relative flex h-full w-full items-center justify-center">
		<!-- Hero image -->
		<div class="h-[60vh] max-h-[600px] w-[90vw] max-w-4xl">
			<img
				src="/images/garden-image.png"
				alt="Painting of a futuristic space with greenery"
				class="h-full w-full object-cover"
			/>
		</div>
	</div>
	<!-- Title positioned at bottom of fixed header -->
	<div class="absolute bottom-0 left-0 z-10 flex h-fit w-full items-center justify-center pb-16">
		<h1 class="fuck-tailwind font-[Libre_Baskerville] text-neutral-100">
			The Garden of Earthly Intentions
		</h1>
	</div>
</div>

<!-- Spacer to create initial scroll space -->
<div class="h-[100lvh]"></div>

<!-- Article content that scrolls up over the fixed header -->
<div bind:this={articleSection} class="relative z-30 min-h-[100lvh] bg-neutral-200">
	<article
		class="relative mx-auto flex max-w-xl flex-col gap-4 px-4 pt-[10vh] pb-[50vh] font-[Libre_Baskerville] text-[1.1rem] tracking-[-0.01em] text-neutral-800 selection:bg-neutral-500 selection:text-white"
	>
		<div
			data-desc="top gradient"
			class="sticky inset-0 h-[5vh] min-h-6 w-full bg-gradient-to-b from-neutral-200 to-neutral-100/0"
		></div>
		<p>
			The morning dew on the bio-lattice caught the light like a thousand prisms, each droplet a
			tiny sun. Marcus Chen stood at the edge of his vertical farm, watching the green towers pulse
			with their slow, engineered breath. The structures weren&#39;t built—they had been grown,
			coaxed from modified bamboo-kelp hybrids that formed living scaffolds strong as steel. Inside
			their translucent walls, crops grew in perfect spirals, their roots drinking from mist that
			carried precisely calibrated nutrients.
		</p>
		<p>
			&quot;Irrigation cycle complete,&quot; announced Pythia, her voice coming from everywhere and
			nowhere. The robot&#39;s physical form—a sleek amalgam of grown ceramic and metal—stood
			motionless fifty meters away, but her consciousness permeated the entire farm through a
			network of fungal computing threads woven into the soil.
		</p>
		<p>
			Marcus nodded, though the gesture was unnecessary. After forty-three years together, he and
			Pythia had developed a communication that transcended words or gestures. Still, he maintained
			these small human habits. They were anchors.
		</p>
		<p>
			&quot;The new growth in Sector Seven shows unusual pigmentation,&quot; Pythia continued.
			&quot;Shall I adjust the genome?&quot;
		</p>
		<p>
			&quot;Let me see it first,&quot; Marcus said, already walking toward the sector. His boots,
			grown from modified mycelium leather, made no sound on the living path that hardened beneath
			his feet and softened again after he passed.
		</p>
		<p>
			As he walked, his neural implant chimed softly. A message from the Beijing Collective—new data
			from the Tau Ceti probe. He filed it for later. The morning&#39;s work came first.
		</p>
		<p>
			Sector Seven&#39;s anomaly was beautiful—a cascading wall of tomatoes that had developed an
			iridescent sheen, like oil on water. Marcus reached out, touched one gently. The fruit was
			firm, healthy.
		</p>
		<p>
			&quot;It&#39;s the copper uptake,&quot; he said. &quot;The Shirata modification is expressing
			differently in this light spectrum.&quot; He thought for a moment. &quot;Leave it. Document
			everything. Sometimes beauty emerges from the unplanned.&quot;
		</p>
		<p>
			&quot;As you wish.&quot; Pythia&#39;s tone carried what Marcus had learned to recognize as
			amusement. The newer robot consciousnesses had developed something resembling emotions, though
			the philosophers still debated whether they truly felt or merely performed feeling.
		</p>
		<p>
			The sun climbed higher, warming his face. Real sun, filtered through the restored atmosphere.
			His grandfather had told him stories of the brown skies of the late 21st century, before the
			Great Rewilding. Now, the air tasted of green growth and possibility.
		</p>
		<p>
			His wife, Elena, emerged from their house—a sprawling structure that looked like a giant lotus
			flower because it essentially was one. Its petals adjusted throughout the day, opening to
			catch morning light, closing against afternoon heat. She carried their daughter, Sofia, on her
			hip. At three, Sofia was just beginning to understand the difference between the physical and
			virtual worlds.
		</p>
		<p>
			&quot;The Seoul installation is ready,&quot; Elena said. &quot;I&#39;ll need to be there for
			the opening. Just two days.&quot;
		</p>
		<p>
			Marcus took Sofia, who immediately grabbed his beard with sticky fingers. &quot;Virtual
			attendance isn&#39;t enough?&quot;
		</p>
		<p>
			&quot;You know it&#39;s not the same. Art needs presence. The mind-drawings can transport you
			anywhere, but the physical pieces...&quot; She gestured at the farm around them. &quot;They
			need the same thing your tomatoes need. Real light. Real space. Real observers.&quot;
		</p>
		<p>
			He understood. It was why they had chosen to remain on Earth when ninety-seven percent of
			humanity had dispersed to the orbital cities, the Mars colonies, the generation ships, or
			worse—the pleasure domes of Venus where time ceased to have meaning.
		</p>
		<p>&quot;Papa, why is the sky blue?&quot; Sofia asked, pointing upward.</p>
		<p>
			Marcus sat on the living bench that formed from the ground, cradling her. &quot;Because the
			air scatters the light. Like when you throw seeds to the chickens and they spread
			everywhere.&quot;
		</p>
		<p>&quot;But why?&quot;</p>
		<p>
			He smiled. The eternal question of children. &quot;Because that&#39;s how photons dance with
			molecules. Everything dances, Sofia. Even the light.&quot;
		</p>
		<p>
			Pythia approached, her movements fluid as water. &quot;Marcus, you have visitors approaching.
			The Johansen family. They appear to be on foot.&quot;
		</p>
		<p>
			Marcus frowned. The Johansens lived forty kilometers away. To walk that distance meant
			something was wrong with their transport, or—
		</p>
		<p>
			&quot;Their son,&quot; Elena said quietly. &quot;Remember? He&#39;s been talking about the
			domes.&quot;
		</p>
		<p>
			Marcus&#39;s stomach tightened. Another one. Last month, it had been the Weatherby girl.
			Twenty-two years old, brilliant, working on new algorithms for the fusion reactors. Then one
			day, she simply walked to the nearest transport hub and took a one-way pod to Venus.
		</p>
		<p>
			The pleasure domes weren&#39;t forced on anyone. That was their insidious nature. They called
			to people, promised an end to struggle, to boredom, to the weight of consciousness itself.
			Inside, every desire was met instantly. Neural stimulation provided perfect happiness. Time
			became elastic. Some claimed to live entire lifetimes in moments, experiencing pleasures
			beyond human comprehension.
		</p>
		<p>
			But they never came back. Not because they couldn&#39;t—the exit doors remained open. They
			simply didn&#39;t want to. Why would they? Why choose struggle when you could have perfection?
		</p>
		<p>
			The Johansens arrived as the morning turned toward noon. They looked older than their sixty
			years, worn by worry. Their son, David, walked between them, his eyes carrying that distant
			look Marcus had learned to recognize.
		</p>
		<p>
			&quot;We thought,&quot; Mrs. Johansen began, then stopped. &quot;We thought if he could see
			your farm, talk to you...&quot;
		</p>
		<p>
			David was twenty-five, with the soft look of someone who spent most of his time in virtual
			spaces. He stared at the growing towers with polite disinterest.
		</p>
		<p>
			&quot;Would you like to help with the harvest?&quot; Marcus offered. &quot;We&#39;re gathering
			the new strain today.&quot;
		</p>
		<p>David shrugged. &quot;The robots can do it faster.&quot;</p>
		<p>&quot;Yes,&quot; Marcus agreed. &quot;But that&#39;s not the point.&quot;</p>
		<p>
			&quot;Then what is the point?&quot; The young man&#39;s voice carried a challenge. &quot;You
			spend your days doing work that could be automated. You limit yourself to one planet when you
			could explore virtual infinities. You choose pain and aging and loss when you could
			have—&quot;
		</p>
		<p>&quot;David,&quot; his father warned.</p>
		<p>
			&quot;No, it&#39;s a fair question,&quot; Marcus said. He looked at the young man. &quot;Tell
			me, when was the last time you were surprised?&quot;
		</p>
		<p>David blinked. &quot;What?&quot;</p>
		<p>
			&quot;Surprised. By something unexpected. Something you didn&#39;t choose or design.&quot;
		</p>
		<p>&quot;I... the new synthesis worlds have randomized elements—&quot;</p>
		<p>
			&quot;But within parameters you set. Even the randomness is curated.&quot; Marcus gestured to
			the iridescent tomatoes. &quot;This morning, I found these. A mutation I didn&#39;t plan,
			couldn&#39;t have predicted. It surprised me. And in that surprise, I found wonder.&quot;
		</p>
		<p>&quot;You can program wonder. The dome AIs can stimulate—&quot;</p>
		<p>
			&quot;Can they?&quot; Elena stepped forward, Sofia still on her hip. &quot;Can they really? Or
			can they only simulate the chemical signatures of wonder? David, I create mind-drawings. I
			know the power of constructed experience. But I also know its limits.&quot;
		</p>
		<p>
			She set Sofia down, and the child immediately ran to a patch of flowers—real ones, not
			engineered, that had volunteered themselves among the crops. &quot;Watch her,&quot; Elena
			said. &quot;She doesn&#39;t know those flowers are weeds. To her, they&#39;re miracles.
			That&#39;s real wonder—the kind that comes from encountering something genuinely other,
			genuinely beyond yourself.&quot;
		</p>
		<p>David&#39;s expression wavered. &quot;But suffering—&quot;</p>
		<p>
			&quot;Is also real,&quot; Marcus said. &quot;Last year, blight took half our crop. We felt
			that loss. But we also felt the satisfaction of solving the problem, of breeding resistant
			strains. The pleasure domes offer happiness without meaning. We choose meaning, even when it
			comes with pain.&quot;
		</p>
		<p>
			They talked through the afternoon. David helped with the harvest, his soft hands learning the
			weight of real fruit. Pythia and the other robots worked alongside them—not as servants but as
			partners. Marcus explained his work with the fusion reactors, how each one required constant
			adjustment, how he could feel their rhythms like heartbeats.
		</p>
		<p>
			&quot;I received new data from Tau Ceti this morning,&quot; Marcus said as they worked.
			&quot;Want to see?&quot;
		</p>
		<p>
			David&#39;s eyes lit up—the first genuine interest he&#39;d shown. They sat in the shade of a
			grown-wood pavilion, and Marcus projected the data into the air between them. Stars wheeled,
			planets danced, and in the spectral analysis, hints of something that might be life.
		</p>
		<p>
			&quot;The probe will take another forty years to arrive,&quot; Marcus said. &quot;I might not
			live to see what it finds. But my children will. Or their children. That&#39;s another kind of
			immortality—the kind that comes from being part of something larger than yourself.&quot;
		</p>
		<p>
			As the sun set, painting the sky in impossible colors, the Johansens prepared to leave. David
			lingered, looking back at the farm.
		</p>
		<p>&quot;I don&#39;t know,&quot; he said quietly. &quot;I still don&#39;t know.&quot;</p>
		<p>&quot;That&#39;s okay,&quot; Marcus said. &quot;Uncertainty is human too.&quot;</p>
		<p>
			After they left, Marcus found himself on the observation deck he&#39;d grown at the top of the
			tallest tower. Elena joined him, Sofia asleep against her shoulder. The stars were emerging,
			and among them, the lights of the orbital cities, the bright spark of a launching interstellar
			vessel.
		</p>
		<p>&quot;Do you think we saved him?&quot; Elena asked.</p>
		<p>
			&quot;I don&#39;t know. But we showed him something. An alternative.&quot; He put his arm
			around her. &quot;Sometimes I wonder if we&#39;re the crazy ones. Three percent of humanity,
			clinging to dirt and struggle.&quot;
		</p>
		<p>&quot;Maybe,&quot; Elena said. &quot;But look.&quot;</p>
		<p>
			She pointed to where Pythia and the other robots had gathered in the field. They were
			dancing—a slow, graceful movement that served no utilitarian purpose. They had learned it from
			humans, adopted it, made it their own.
		</p>
		<p>
			&quot;We&#39;re not just preserving humanity,&quot; Elena said. &quot;We&#39;re teaching it.
			To them, to our children, to the future. The pleasure domes are sterile. Nothing grows there,
			nothing evolves. But here...&quot;
		</p>
		<p>
			Here, Marcus thought, completing her sentence in his mind. Here, life continues. Messy,
			painful, uncertain, beautiful life.
		</p>
		<p>
			Sofia stirred in her sleep, murmuring something about blue skies and dancing light. Marcus
			kissed the top of her head, breathing in the smell of earth and growth and tomorrow.
		</p>
		<p>
			In the distance, a transport rose toward orbit, carrying someone to the domes or the stars.
			Marcus didn&#39;t know which. But here on Earth, in their grown house among the vertical
			farms, surrounded by thinking machines and living architecture, they would continue their
			small, vital work.
		</p>
		<p>
			They would tend their garden. They would raise their children. They would dance with robots
			under foreign stars.
		</p>
		<p>They would remain human.</p>
		<p>
			And that, Marcus thought as the first fusion reactor of the evening cycle hummed to life, its
			song harmonizing with the whisper of growing things—that was enough.
		</p>

		<div class="pt-18 text-[1.2rem] text-neutral-500">
			<p class="w-full font-bold">with hope for the twenty-second century on Earth</p>
		</div>
	</article>
</div>

<style>
	.fuck-tailwind {
		font-size: clamp(3.3rem, 5.5vw, 8rem);
	}
</style>
