# is-it-block
is it ethereum block &lt;blockhash> cli?

## Requirements

Node 8.0 or greater (you need async/await support)
## Usage

A simple utility to determine whether a block exists or not.  If the target block does not exist,
the utility will continue to poll until the block exists.

```
npm i
node index.js -n <blocknumber>
```
