<script>
	import { onMount } from 'svelte'

	// Props for sun control (can be overridden by parent)
	let { sunHeight = 0.3, sunAngle = 0.5, showControls = true } = $props()

	// Canvas reference
	let canvas = $state()
	let gl = $state()
	let program = $state()
	let animationFrame = $state()

	// Uniform locations
	let uniforms = $state({})

	const vertexShaderSource = `
		attribute vec2 a_position;
		void main() {
			gl_Position = vec4(a_position, 0.0, 1.0);
		}
	`

	const fragmentShaderSource = `
		precision highp float;
		
		uniform vec2 u_resolution;
		uniform float u_sunHeight;
		uniform float u_sunAngle;
		uniform float u_time;
		
		#define PI 3.14159265359
		
		struct ray_t {
			vec3 origin;
			vec3 direction;
		};
		
		struct sphere_t {
			vec3 origin;
			float radius;
			int material;
		};
		
		mat3 rotate_around_x(float angle_degrees) {
			float angle = radians(angle_degrees);
			float _sin = sin(angle);
			float _cos = cos(angle);
			return mat3(1.0, 0.0, 0.0, 0.0, _cos, -_sin, 0.0, _sin, _cos);
		}
		
		mat3 rotate_around_y(float angle_degrees) {
			float angle = radians(angle_degrees);
			float _sin = sin(angle);
			float _cos = cos(angle);
			return mat3(_cos, 0.0, _sin, 0.0, 1.0, 0.0, -_sin, 0.0, _cos);
		}
		
		ray_t get_primary_ray(vec3 cam_local_point, vec3 cam_origin, vec3 cam_look_at) {
			vec3 fwd = normalize(cam_look_at - cam_origin);
			vec3 up = vec3(0.0, 1.0, 0.0);
			vec3 right = cross(up, fwd);
			up = cross(fwd, right);
			
			ray_t r;
			r.origin = cam_origin;
			r.direction = normalize(fwd + up * cam_local_point.y + right * cam_local_point.x);
			return r;
		}
		
		bool isect_sphere(ray_t ray, sphere_t sphere, out float t0, out float t1) {
			vec3 rc = sphere.origin - ray.origin;
			float radius2 = sphere.radius * sphere.radius;
			float tca = dot(rc, ray.direction);
			float d2 = dot(rc, rc) - tca * tca;
			if (d2 > radius2) return false;
			float thc = sqrt(radius2 - d2);
			t0 = tca - thc;
			t1 = tca + thc;
			return true;
		}
		
		// Scattering coefficients at sea level (m)
		const vec3 betaR = vec3(5.5e-6, 13.0e-6, 22.4e-6); // Rayleigh
		const vec3 betaM = vec3(21e-6); // Mie
		
		// Scale height (m)
		const float hR = 7994.0; // Rayleigh
		const float hM = 1200.0; // Mie
		
		float rayleigh_phase_func(float mu) {
			return 3.0 * (1.0 + mu*mu) / (16.0 * PI);
		}
		
		// Henyey-Greenstein phase function
		const float g = 0.76;
		float henyey_greenstein_phase_func(float mu) {
			return (1.0 - g*g) / ((4.0 * PI) * pow(1.0 + g*g - 2.0*g*mu, 1.5));
		}
		
		const float earth_radius = 6360e3; // (m)
		const float atmosphere_radius = 6420e3; // (m)
		
		vec3 sun_dir = vec3(0.0, 1.0, 0.0);
		const float sun_power = 20.0;
		
		const int num_samples = 16;
		const int num_samples_light = 8;
		
		bool get_sun_light(ray_t ray, out float optical_depthR, out float optical_depthM) {
			sphere_t atmosphere;
			atmosphere.origin = vec3(0.0, 0.0, 0.0);
			atmosphere.radius = atmosphere_radius;
			atmosphere.material = 0;
			
			float t0, t1;
			isect_sphere(ray, atmosphere, t0, t1);
			
			float march_pos = 0.0;
			float march_step = t1 / float(num_samples_light);
			
			for (int i = 0; i < num_samples_light; i++) {
				vec3 s = ray.origin + ray.direction * (march_pos + 0.5 * march_step);
				float height = length(s) - earth_radius;
				if (height < 0.0) return false;
				
				optical_depthR += exp(-height / hR) * march_step;
				optical_depthM += exp(-height / hM) * march_step;
				
				march_pos += march_step;
			}
			
			return true;
		}
		
		vec3 get_incident_light(ray_t ray) {
			sphere_t atmosphere;
			atmosphere.origin = vec3(0.0, 0.0, 0.0);
			atmosphere.radius = atmosphere_radius;
			atmosphere.material = 0;
			
			float t0, t1;
			if (!isect_sphere(ray, atmosphere, t0, t1)) {
				return vec3(0.0);
			}
			
			float march_step = t1 / float(num_samples);
			
			// Cosine of angle between view and light directions
			float mu = dot(ray.direction, sun_dir);
			
			// Phase functions
			float phaseR = rayleigh_phase_func(mu);
			float phaseM = henyey_greenstein_phase_func(mu);
			
			// Optical depth
			float optical_depthR = 0.0;
			float optical_depthM = 0.0;
			
			vec3 sumR = vec3(0.0);
			vec3 sumM = vec3(0.0);
			float march_pos = 0.0;
			
			for (int i = 0; i < num_samples; i++) {
				vec3 s = ray.origin + ray.direction * (march_pos + 0.5 * march_step);
				float height = length(s) - earth_radius;
				
				// Integrate the height scale
				float hr = exp(-height / hR) * march_step;
				float hm = exp(-height / hM) * march_step;
				optical_depthR += hr;
				optical_depthM += hm;
				
				// Gather the sunlight
				ray_t light_ray;
				light_ray.origin = s;
				light_ray.direction = sun_dir;
				
				float optical_depth_lightR = 0.0;
				float optical_depth_lightM = 0.0;
				bool overground = get_sun_light(light_ray, optical_depth_lightR, optical_depth_lightM);
				
				if (overground) {
					vec3 tau = betaR * (optical_depthR + optical_depth_lightR) + 
							  betaM * 1.1 * (optical_depthM + optical_depth_lightM);
					vec3 attenuation = exp(-tau);
					
					sumR += hr * attenuation;
					sumM += hm * attenuation;
				}
				
				march_pos += march_step;
			}
			
			return sun_power * (sumR * phaseR * betaR + sumM * phaseM * betaM);
		}
		
		void main() {
			vec2 aspect_ratio = vec2(u_resolution.x / u_resolution.y, 1.0);
			float fov = tan(radians(45.0));
			vec2 point_ndc = gl_FragCoord.xy / u_resolution.xy;
			vec3 point_cam = vec3((2.0 * point_ndc - 1.0) * aspect_ratio * fov, -1.0);
			
			vec3 col = vec3(0.0);
			
			// Sun direction based on sun angle and position
			// Map sun angle: 0 = below horizon (-90°), 0.5 = horizon (0°), 1 = zenith (+90°)
			float elevationAngle = (u_sunHeight - 0.5) * 180.0; // -90 to +90 degrees
			
			// Map sun position: 0 = east (-60°), 0.5 = south (0°), 1 = west (+60°)
			float azimuthAngle = (u_sunAngle - 0.5) * 120.0; // -60 to +60 degrees
			
			// Apply rotations to get sun direction
			mat3 rotX = rotate_around_x(elevationAngle);
			mat3 rotY = rotate_around_y(azimuthAngle);
			sun_dir = vec3(0.0, 1.0, 0.0) * rotX * rotY;
			
			// Sky dome angles - always show this view
			vec3 p = point_cam;
			float z2 = p.x * p.x + p.y * p.y;
			float phi = atan(p.y, p.x);
			float theta = acos(1.0 - z2);
			vec3 dir = vec3(
				sin(theta) * cos(phi),
				cos(theta),
				sin(theta) * sin(phi)
			);
			
			ray_t ray;
			ray.origin = vec3(0.0, earth_radius + 1.0, 0.0);
			ray.direction = dir;
			
			col = get_incident_light(ray);
			
			// Subtle blue enhancement around 0.35-0.65 sun angle range
			float blueEnhanceRange = smoothstep(0.3, 0.5, u_sunHeight) * smoothstep(0.7, 0.5, u_sunHeight);
			
			// More subtle saturation boost
			float blueSaturation = 1.0 + blueEnhanceRange * 0.15; // Reduced to 15%
			col.b *= blueSaturation;
			
			// Gentle brightness boost
			float brightnessBoost = 1.0 + blueEnhanceRange * 0.1; // Reduced to 10%
			col *= brightnessBoost;
			
			// Beautiful sunrise colors for high sun angles (0.80-0.95)
			float sunriseRange = smoothstep(0.75, 0.85, u_sunHeight) * smoothstep(1.0, 0.9, u_sunHeight);
			
			// Add pink/magenta tinting that mixes with natural orange
			vec3 sunriseTint = vec3(1.2, 0.7, 1.1); // Pink-magenta with some red
			col = mix(col, col * sunriseTint, sunriseRange * 0.3);
			
			// Enhance the warmth and saturation during sunrise
			float sunriseWarmth = 1.0 + sunriseRange * 0.2;
			col.r *= sunriseWarmth;
			col.g *= 1.0 + sunriseRange * 0.1;
			
			gl_FragColor = vec4(col, 1.0);
		}
	`

	function createShader(gl, type, source) {
		const shader = gl.createShader(type)
		gl.shaderSource(shader, source)
		gl.compileShader(shader)

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('Error compiling shader:', gl.getShaderInfoLog(shader))
			gl.deleteShader(shader)
			return null
		}

		return shader
	}

	function createProgram(gl, vertexShader, fragmentShader) {
		const program = gl.createProgram()
		gl.attachShader(program, vertexShader)
		gl.attachShader(program, fragmentShader)
		gl.linkProgram(program)

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Error linking program:', gl.getProgramInfoLog(program))
			gl.deleteProgram(program)
			return null
		}

		return program
	}

	function initWebGL() {
		if (!canvas) return

		gl = canvas.getContext('webgl')
		if (!gl) {
			console.error('WebGL not supported')
			return
		}

		const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
		const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
		program = createProgram(gl, vertexShader, fragmentShader)

		// Create buffer for quad vertices
		const positionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
		const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

		// Get attribute and uniform locations
		uniforms = {
			position: gl.getAttribLocation(program, 'a_position'),
			resolution: gl.getUniformLocation(program, 'u_resolution'),
			sunHeight: gl.getUniformLocation(program, 'u_sunHeight'),
			sunAngle: gl.getUniformLocation(program, 'u_sunAngle'),
			time: gl.getUniformLocation(program, 'u_time')
		}

		render()
	}

	function render() {
		if (!gl || !program) return

		gl.viewport(0, 0, canvas.width, canvas.height)
		gl.clear(gl.COLOR_BUFFER_BIT)

		gl.useProgram(program)

		gl.enableVertexAttribArray(uniforms.position)
		gl.vertexAttribPointer(uniforms.position, 2, gl.FLOAT, false, 0, 0)

		gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
		gl.uniform1f(uniforms.sunHeight, sunHeight)
		gl.uniform1f(uniforms.sunAngle, sunAngle)
		gl.uniform1f(uniforms.time, Date.now() * 0.001)

		gl.drawArrays(gl.TRIANGLES, 0, 6)

		animationFrame = requestAnimationFrame(render)
	}

	onMount(() => {
		initWebGL()

		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame)
			}
		}
	})
</script>

<div class="atmosphere-container">
	<canvas bind:this={canvas} width="800" height="600" class="atmosphere-canvas" />

	{#if showControls}
		<div class="controls">
			<div class="slider-container">
				<label for="sunHeight">Sun Height:</label>
				<input
					type="range"
					id="sunHeight"
					class="slider"
					min="0"
					max="1"
					step="0.01"
					bind:value={sunHeight}
				/>
				<span class="value">{sunHeight.toFixed(2)}</span>
			</div>

			<div class="slider-container">
				<label for="sunAngle">Sun Angle:</label>
				<input
					type="range"
					id="sunAngle"
					class="slider"
					min="0"
					max="1"
					step="0.01"
					bind:value={sunAngle}
				/>
				<span class="value">{sunAngle.toFixed(2)}</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.atmosphere-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: #000;
		font-family: Arial, sans-serif;
	}

	.atmosphere-canvas {
		cursor: crosshair;
	}

	.controls {
		margin-top: 20px;
		color: white;
		text-align: center;
	}

	.slider-container {
		margin: 10px 0;
	}

	.slider {
		width: 300px;
		margin: 0 10px;
	}

	label {
		display: inline-block;
		width: 120px;
		text-align: right;
		margin-right: 10px;
	}

	.value {
		display: inline-block;
		width: 50px;
		text-align: left;
	}
</style>
