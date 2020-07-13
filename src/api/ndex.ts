// export async function fetchNetwork(uuid: string) {
//   console.info('fetch net::', uuid)

//   let { data } = await fetch(`${PUBLIC_URL}${uuid}/summary`)

//   await new Promise((r) => setTimeout(r, 5000))
//   return cx
// }

// export async function fetchProject(key, { id }) {
//   console.info('fetch project id', id)
//   let { data } = await axios.get(`https://api.github.com/repos/tannerlinsley/${id}`)
//   await new Promise((r) => setTimeout(r, 1000))
//   return data
// }

import HttpResponse from './HttpResponse'

export async function callApi<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request)

  try {
    response.parsedBody = await response.json()
  } catch (ex) {
    console.error('API Call error:', ex)
  }

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response
}

