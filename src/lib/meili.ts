import { MeiliSearch } from 'meilisearch'
import data from '../assets/data.json'

export const BOOKS_INDEX = 'books' as const

export type TBook = {
  id: string
  author: string
  genre: string
  name: string
  price: number
  reviews: number
  user_rating: number
  year: number
}

export type TResult = {
  books: Array<TBook>
  hits: number
  took: number
}

export const client = new MeiliSearch({
  host: 'http://127.0.0.1:7700',
  apiKey: 'mmk'
})

export const reloadIndex = async () => {
  await client.deleteIndexIfExists(BOOKS_INDEX)

  const parsed = data.map((d, idx) => ({
    id: `book-${idx + 1}`,
    ...d
  }))

  const index = client.index(BOOKS_INDEX)
  await index.addDocuments(parsed)
}

export const searchBooks = async (term: string): Promise<TResult> => {
  const index = client.index(BOOKS_INDEX)
  const result = await index.search(term, {
    limit: Number.MAX_SAFE_INTEGER
  })

  return {
    books: result.hits as Array<TBook>,
    hits: result.estimatedTotalHits,
    took: result.processingTimeMs
  }
}
