import fetch from 'node-fetch'
import { getError } from './rpc'
import { NextApiResponse } from 'next'
import {
  API_ENDPOINT,
  NOTION_TOKEN,
  NOTION_ACTIVE_USER_HEADER,
} from './server-constants'

export default async function getNotionAsset(
  res: NextApiResponse,
  assetUrl: string,
  blockId: string
): Promise<{
  signedUrls: string[]
}> {
  const requestURL = `${API_ENDPOINT}/getSignedFileUrls`
  const assetRes = await fetch(requestURL, {
    method: 'POST',
    headers: {
      cookie: `token_v2=${NOTION_TOKEN}`,
      'content-type': 'application/json',
      'x-notion-active-user-header': `${NOTION_ACTIVE_USER_HEADER}`,
    },
    body: JSON.stringify({
      urls: [
        {
          url: assetUrl,
          permissionRecord: {
            table: 'block',
            id: blockId,
          },
        },
      ],
    }),
  })

  if (assetRes.ok) {
    return assetRes.json()
  } else {
    console.log('bad request', assetRes.status)
    res.json({ status: 'error', message: 'failed to load Notion asset' })
    throw new Error(await getError(assetRes))
  }
}
