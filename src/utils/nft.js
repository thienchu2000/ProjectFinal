const IPFS = require("ipfs-http-client");
const fs = require("fs");

const projectId = "YOUR_INFURA_PROJECT_ID";
const projectSecret = "YOUR_INFURA_PROJECT_SECRET";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfs = IPFS.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

async function uploadFile(filePath) {
  const file = fs.readFileSync(filePath);
  const added = await ipfs.add({ content: file });
  return added.path;
}

async function uploadMetadata(metadata) {
  const added = await ipfs.add(JSON.stringify(metadata));
  return added.path;
}

(async () => {
  const imagePath = await uploadFile("path/to/your/image.png");
  console.log(`Image IPFS Path: ${imagePath}`);

  const metadata = {
    name: "My Awesome NFT",
    description: "This is a description of my awesome NFT",
    image: `ipfs://${imagePath}`,
    attributes: [
      {
        trait_type: "Rarity",
        value: "Legendary",
      },
      {
        trait_type: "Power",
        value: 100,
      },
    ],
  };

  const metadataPath = await uploadMetadata(metadata);
  console.log(`Metadata IPFS Path: ${metadataPath}`);
})();
