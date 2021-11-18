Deno makes it easy to lock down the runtime from accessing network, disk and
environment variables. It allows infra `operators` to enforce hermeticity by
using a combination of lock files and cache only builds.

```bash
# alice.js is written by developer

# allowed_deps is maintained by operator
# remove cache if it already exists
rm -rf $denoDir  # deno info --json

# install only allowed cache and write a lock file. this step would probably be a copy of an existing cache in real world.
deno cache --lock=lock.json --lock-write allowed_deps.ts

# run with --cached only. is run by operator. The script only has read/write disk access to alice.yaml file but nothing else: network, environment etc.
deno run --lock=lock.json --allow-read=alice.yaml --allow-write=alice.yaml --cached-only alice.js
```

creates a `alice.yaml` file

```yaml
name: Alice
beverage: Club-Mate
monitors: 2
languages:
  - python
  - haskell
  - c++
  - 68k assembly
```

- About caching, integrity checking and lock files:
  https://deno.land/manual/linking_to_external_code/integrity_checking

- About permissions:
  https://deno.land/manual@v1.16.2/getting_started/permissions
