import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'
import { CxToJs, CyNetworkUtils } from 'cytoscape-cx2js'

const PUBLIC_URL = 'http://dev.ndexbio.org/v2/network/'
// const PUBLIC_URL = 'http://public.ndexbio.org/v2/network/'

const utils = new CyNetworkUtils()
const cx2js = new CxToJs(utils)

const getNetwork = async <T>(_, uuid: string, serverUrl: string) => {
  let url = `${PUBLIC_URL}${uuid}`
  const response: HttpResponse<T> = await fetch(url)

  try {
    response.parsedBody = await response.json()
  } catch (ex) {
    console.error('API Call error:', ex)
  }

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return cx2cyjs(uuid, response.parsedBody)
}

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
        uuid
      },
      elements
    },
    cx,
    visualStyle: style,
  }
}

export default function useNetwork(uuid: string, serverUrl: string = PUBLIC_URL) {
  return useQuery(['network', uuid, serverUrl], getNetwork)
}
