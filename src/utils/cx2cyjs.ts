import { CxToJs, CyNetworkUtils } from '@js4cytoscape/cx2js'
import { CxToCyCanvas } from '@js4cytoscape/cyannotation-cx2js'

const utils = new CyNetworkUtils()
const cx2js = new CxToJs(utils)

const annotationRenderer = new CxToCyCanvas(cx2js);

const getAnnotationRenderer = () => {
  return annotationRenderer
}

const cx2cyjs = (uuid: string, cx: any) => {
  const niceCX = utils.rawCXtoNiceCX(cx)
  const attributeNameMap = {}
  const elementsObj = cx2js.cyElementsFromNiceCX(niceCX, attributeNameMap)

  // This contains original style.
  const style = cx2js.cyStyleFromNiceCX(niceCX, attributeNameMap)
  const elements = [...elementsObj.nodes, ...elementsObj.edges]

  const annotationNiceCX = {
      "networkAttributes" : niceCX["networkAttributes"] 
        ? niceCX["networkAttributes"]: { "elements" : [] }
    }

  return {
    network: {
      data: {
        uuid,
      },
      elements,
    },
    visualStyle: style,
    annotationNiceCX: annotationNiceCX
  }
}

export { cx2cyjs, getAnnotationRenderer }
