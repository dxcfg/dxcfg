fmt: 
	deno fmt
lint: 
	deno lint --config deno.json
test: lint fmt
	deno test --allow-write --allow-read
test-watch: 
	deno test --unstable --watch --allow-write --allow-read --no-check