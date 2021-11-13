import { write } from 'https://deno.land/x/dxcfg@v0.0.3/mod.ts'
const alice = {
    name: 'Alice',
    beverage: 'Club-Mate',
    monitors: 2,
    languages: [
        'python',
        'haskell',
        'c++',
        '68k assembly', // Alice is cool like that!
    ],
};

await write(alice, 'alice.yaml')