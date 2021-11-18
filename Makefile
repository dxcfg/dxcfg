lint: 
	deno lint --config deno.json
test: 
	deno test --allow-write --allow-read
test-watch: 
	deno test --unstable --watch --allow-write --allow-read --no-check