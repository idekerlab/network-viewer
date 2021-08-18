#!/bin/bash

echo 'Building NNV...'
echo 'Removing existing yarn links...'

rm -rf ~/.config/yarn/link/ndex-client
rm -rf ~/.config/yarn/link/cytoscape-explore-components
rm -rf ~/.config/yarn/link/cx-viz-converter
rm -rf ~/.config/yarn/link/react
rm -rf ~/.config/yarn/link/react-dom

# Clone all required repos
git clone https://github.com/idekerlab/network-viewer.git
git clone https://github.com/cytoscape/cx-viz-converter.git
git clone https://github.com/idekerlab/large-graph-renderer.git
git clone https://github.com/idekerlab/ce-components.git
git clone https://github.com/ndexbio/ndex-js-client.git

cd ndex-js-client
git checkout develop
yarn install
yarn build
yarn link

cd ../cx-viz-converter
yarn install
yarn build
yarn link

cd ../ce-components
git checkout develop
yarn install
yarn build
yarn link

cd ../large-graph-renderer
git checkout develop
yarn link cx-viz-converter
yarn add --peer react react-dom
yarn install
yarn build
yarn link

cd ../network-viewer
yarn link ndex-client cytoscape-explore-components cx-viz-converter
yarn install
cd ./node_modules/react && yarn link
cd ../react-dom && yarn link
cd ../../../ce-components
rm -rf ./node_modules


echo '------------ Linking Again -------------'
yarn link react react-dom
yarn install
yarn build
echo '------------ CE Components are ready! -------------'

cd ../network-viewer
yarn start



echo 'Done!'