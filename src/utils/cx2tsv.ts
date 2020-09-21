const removeTabsAndPipesFromString = (strToNormalize : String) => {
    const strWithoutTabsOrPipes = strToNormalize.replace(/\t/g, ' ').replace(/\|/g, ' ');
    return strWithoutTabsOrPipes;
};

const getNodeNameFromNodeObj = (nodeObj) => {

    var nodeName = 'No Name';

    if (nodeObj) {

        if (nodeObj.n) {
            nodeName = nodeObj.n;

        } else if (nodeObj.id) {
            nodeName = nodeObj.id;
        }
    }
    return nodeName;
};

const getEdgeInfo = (niceCX, edgeId) => {
    if ( !niceCX) return null;

    var edge = niceCX.edges[edgeId];
    var edgeInfo = { 'id': edgeId,
                    s: edge.s,
                    t: edge.t,
                    i: edge.i};
    var counter;
    if ( niceCX.edgeAttributes && niceCX.edgeAttributes[edgeId]) {
        var edgeAttrs = niceCX.edgeAttributes[edgeId];
        edgeAttrs.forEach ( (value, pname) => {
            if ( pname != 'selected') {
                if ( !edgeInfo[pname]) {
                    edgeInfo[pname] = value;
                } else {
                    while (edgeInfo[pname+ '_' + counter]) {
                        counter++;
                    };
                    edgeInfo[pname+ '_' + counter] = value;
                    counter++;
                }   
            }
        });
    }

    if ( niceCX.edgeCitations && niceCX.edgeCitations[edgeId]) {
        var citationList = [];
        niceCX.edgeCitations[edgeId].forEach( ( citationId) => {
            citationList.push ( niceCX.citations[citationId]);
        });
        if (citationList.length >0 )
            edgeInfo['citations'] = citationList;
    }

    return edgeInfo;
};

export const getTSVOfCurrentNiceCX = (niceCX) => {

    /*
     Source		Node name (if Node Name missing, then represents, node Id)
     Interaction
     Target		Node name (if Node Name missing, then represents, node Id)
     Source Id
     Source Alias
     Source Properties 1,2,3
     Target Id
     Target Alias
     Target Properties 1,2,3
     Citation
     Edge Properties 1,2,3
     cx edge id
     cx source node id
     cx target node id
     */

    var network = niceCX;

    var edges = network.edges;
    var edgeKeys = Object.keys(edges);


    let data = [];
    var row = {};

    var edgeAttributes = network.edgeAttributes;

    var headers = {'Source Node': 0, Interaction: 1, 'Target Node': 2, 'Source ID': 3, 'Source Alias': 4};
    var sourceAliasOrder = headers['Source Alias'];
    var headersSize = 0;


    var nodes = network.nodes;

    var nodeKeys = Object.keys(nodes);
    var nodeAttributes = network.nodeAttributes;
    var aliasColumnHeader = null;

    for (var key in nodeKeys)
    {
        var nodeId = nodeKeys[key];
        
        if (nodeAttributes) {

            var nodeAttrs = nodeAttributes[nodeId];

            for (var key1 in nodeAttrs) {
                var attributeObj = (nodeAttrs[key1]) ? (nodeAttrs[key1]) : "";

                var attributeObjName = removeTabsAndPipesFromString(attributeObj['n']);

                var attributeObjNameSource = 'Source ' + attributeObjName;

                if (attributeObjName && (attributeObjName.toLowerCase() == 'alias')) {
                    aliasColumnHeader = attributeObjName;
                    if (!(attributeObjNameSource in headers)) {
                        delete headers['Source Alias'];
                        headers[attributeObjNameSource] = sourceAliasOrder;
                    }
                }
                //var attributeObjNameTarget = 'Target ' + attributeObjName;

                if (!(attributeObjNameSource in headers)) {
                    headers[attributeObjNameSource] = Object.keys(headers).length;
                }

                //if (!(attributeObjNameTarget in headers)) {
                //    headers[attributeObjNameTarget] = Object.keys(headers).length;
                //}
            }
        }
    }

    headers['Target ID']    = Object.keys(headers).length;
    headers['Target Alias'] = Object.keys(headers).length;
    var targetAliasOrder    = headers['Target Alias'];



    for (var key in nodeKeys)
    {
        var nodeId = nodeKeys[key];

        if (nodeAttributes) {

            var nodeAttrs = nodeAttributes[nodeId];

            for (var key1 in nodeAttrs) {
                var attributeObj = (nodeAttrs[key1]) ? (nodeAttrs[key1]) : "";

                var attributeObjName = removeTabsAndPipesFromString(attributeObj['n']);

                var attributeObjNameTarget = 'Target ' + attributeObjName;

                if (attributeObjName && (attributeObjName.toLowerCase() == 'alias')) {
                    if (!(attributeObjNameTarget in headers)) {
                        delete headers['Target Alias'];
                        headers[attributeObjNameTarget] = targetAliasOrder;
                    }
                }

                if (!(attributeObjNameTarget in headers)) {
                    headers[attributeObjNameTarget] = Object.keys(headers).length;
                }
            }
        }
    }

    headers['Citation'] = Object.keys(headers).length;
    var citationOrder   = headers['Citation'];

    for(let i = 0; i < edgeKeys.length; i++ )
    {
        var edgeKey = edgeKeys[i];

        if (edgeAttributes) {
            for (var key in edgeAttributes[edgeKey]) {

                var keySanitized = removeTabsAndPipesFromString(key);

                if (keySanitized && (keySanitized.toLowerCase() == 'citation')) {
                    if (!(keySanitized in headers)) {
                        delete headers['Citation'];
                        headers[keySanitized] = citationOrder;
                    }
                }

                if (!(keySanitized in headers)) {
                    headers[keySanitized] = Object.keys(headers).length;
                }
            }
        }
    }

    headers['cx edge id']        = Object.keys(headers).length;
    headers['cx source node id'] = Object.keys(headers).length;
    headers['cx target node id'] = Object.keys(headers).length;


    var headersKeysSorted = Object.keys(headers);
    headersKeysSorted.sort(function(a, b) {
        return headers[a] - headers[b];
    });
    var headerKeysJoined = headersKeysSorted.join('\t') + '\n';

    var fileString      = headerKeysJoined;

    var row = {};

    var nodeAttributesAlreadyProcessed = {'n':0,  'r':0, 'id':0, '_cydefaultLabel':0};
    var edgeAttributesAlreadyProcessed = {'id':0, 's':0, 't':0,  'i':0};

    // Generate Source Node, Source Node Represents, Target Node, Target Node Represents,
    // if present
    for(let i = 0; i < edgeKeys.length; i++ )
    {
        for (key in headers) {
            row[key] = '';
        };

        var rowStringTemp = '';
        var edgeKey       = edgeKeys[i];
        var edgeObj       =  getEdgeInfo(network, edgeKey);


        row['cx edge id']        = (edgeObj && edgeObj.id) ? edgeObj.id : '';
        row['cx source node id'] = (edgeObj && (edgeObj.s || edgeObj.s == 0)) ? edgeObj.s  : '';
        row['Interaction']       = (edgeObj && edgeObj.i)  ? edgeObj.i  : '';
        row['cx target node id'] = (edgeObj && (edgeObj.t || edgeObj.t == 0)) ? edgeObj.t  : '';


        var sourceNodeObj = factory.getNodeInfo(edgeObj['s']);
        var targetNodeObj = factory.getNodeInfo(edgeObj['t']);

        row['Source Node']    = getNodeNameFromNodeObj(sourceNodeObj);
        row['Source ID'] = (sourceNodeObj && sourceNodeObj.r) ? sourceNodeObj.r : '';
        row['Target Node']    = getNodeNameFromNodeObj(targetNodeObj);
        row['Target ID'] = (targetNodeObj && targetNodeObj.r) ? targetNodeObj.r : '';

        // get Source Node attributes
        for (var nodeAttr in sourceNodeObj) {
            var nodeAttrNormalized = removeTabsAndPipesFromString(nodeAttr);
            if (nodeAttrNormalized in nodeAttributesAlreadyProcessed) {
                continue;
            }
            row['Source ' + nodeAttrNormalized] = getAttributeValue(sourceNodeObj[nodeAttr]);
        }
        // get Target Node attributes
        for (nodeAttr in targetNodeObj) {
            var nodeAttrNormalized1 = removeTabsAndPipesFromString(nodeAttr);
            if (nodeAttrNormalized1 in nodeAttributesAlreadyProcessed) {
                continue;
            }
            row['Target ' + nodeAttrNormalized1] = getAttributeValue(targetNodeObj[nodeAttr]);
        }

        // get edge attributes
        for (var edgeAttr in edgeObj) {
            var edgeAttrNormalized = removeTabsAndPipesFromString(edgeAttr);
            if (edgeAttrNormalized in edgeAttributesAlreadyProcessed) {
                continue;
            }
            row[edgeAttrNormalized] = getAttributeValue(edgeObj[edgeAttr]);
        }

        var tabSeparatedRow = '';
        for (key in headersKeysSorted) {
            var rowElement = row[headersKeysSorted[key]];
            tabSeparatedRow = tabSeparatedRow + rowElement + '\t';
        }
        // replace last \t (tab) in tabSeparatedRow with \n (new line)
        tabSeparatedRow = tabSeparatedRow.slice(0, -1) + '\n';

        fileString = fileString + tabSeparatedRow;

    }

    return fileString;
};