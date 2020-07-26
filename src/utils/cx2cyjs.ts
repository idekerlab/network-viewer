import { CxToJs, CyNetworkUtils } from 'cytoscape-cx2js'

const utils = new CyNetworkUtils()
const cx2js = new CxToJs(utils)

const cx2cyjs = (uuid: string, cx: any) => {
  const niceCX = utils.rawCXtoNiceCX(cx)
  const attributeNameMap = {}
  const elementsObj = cx2js.cyElementsFromNiceCX(niceCX, attributeNameMap)

  // This contains original style.
  const style = cx2js.cyStyleFromNiceCX(niceCX, attributeNameMap)
  const elements = [...elementsObj.nodes, ...elementsObj.edges]

  return {
    network: {
      data: {
        uuid,
      },
      elements,
    },
    visualStyle: style,
  }
}

export { cx2cyjs }
