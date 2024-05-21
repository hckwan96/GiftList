const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

const merkleTree = new MerkleTree(niceList);

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// Usage inside aync function do not need closure demo only
// When done reading prompt, exit program 
rl.on('close', () => process.exit(0));


async function main() {
  // TODO: how do we prove to the server we're on the nice list? ✅

  const root = merkleTree.getRoot();

  (async() => {
    try {
      let name = await prompt("Please enter name to check: ");

      const index = niceList.findIndex(n => n === name);
      const proof = merkleTree.getProof(index);
      
      //console.log("proof:", proof);

      const body = {
        proof,
        leaf: name,
      };

      const { data: gift } = await axios.post(`${serverUrl}/gift`, body);


      console.log(`${name}, ${ gift }`);

      rl.close();
    }
    catch (e) {
      console.error("Unable to prompt", e);
    }
  })();
  

  
}

main();