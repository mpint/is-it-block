var ora = require('ora');
var axios = require('axios');
var colors = require('colors');
var program = require('commander');

program
  .version('0.0.1')
  .option('-b, --blockchain [name]', 'Blockchain [name]')
  .option('-n, --block [number]', 'Ethereum block [number]')
  .parse(process.argv);

(async function init(program) {
  // poll blockchain explorer for existance of target block
  const getCurrentBlock = async (options) => {
    const blockchainRoot = options.blockchain === 'ETH' ?
      'https://etherchain.org/api/blocks' : '';
    
    try {
      const result = await axios.get(
        `${blockchainRoot}/1/1`,
        { 'cache-control': 'no-cache' }
      );

      return result.data.data[0].number;
    } catch (err) {
      throw new Error(err);
    } 
  }

  // default to ethereum blockchain
  // TODO: add other blockchains
  const defaults = {
    blockchain: 'ETH',
    block: 1
  }

  const target = Object.assign(defaults, program);
  const spinner = ora({
    text: `[${target.blockchain}] Is it block ${target.block} yet?`.red,
    color: 'green',
  }).start();

  // outer setTimeout allows the initial spinner text to display for a few seconds
  setTimeout(function() {
    let isNextBlock, blockExists, blocksToGo;
    const pollingId = setInterval(async () => {
      try {
        const currentBlockNumber = await getCurrentBlock(target);
        
        blocksToGo = Number(target.block) - Number(currentBlockNumber);
        blockExists = blocksToGo <= 0;
        isNextBlock = blocksToGo === 1;
        
        if (blockExists) {
          console.log('\007');
          clearTimeout(pollingId);
          spinner.succeed('YES'.green);
          process.exit(0);
        } else {
          spinner.text = (isNextBlock ? 'Next block!' : `Not yet (${blocksToGo} to go...)`).yellow;
        }
      } catch (error) {
        console.log('error', error);
        
        process.exit(1);
      }
    }, 1000);
  }, 3000);

}(program));
