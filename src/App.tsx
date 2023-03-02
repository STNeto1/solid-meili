import { Component, createResource, createSignal, For, Show } from 'solid-js'
import { reloadIndex, searchBooks, TBook, TResult } from './lib/meili'

const [reloading, setReloading] = createSignal(false)
const [searchTerm, setSearchTerm] = createSignal('')
const [openCard, setOpenCard] = createSignal<string | null>(null)

const App: Component = () => {
  const [searchResult, { refetch }] = createResource<TResult, string, TResult>(
    () => searchTerm(),
    async (term) => {
      return await searchBooks(term)
    },
    {
      initialValue: {
        books: [],
        hits: 0,
        took: 0
      }
    }
  )

  const handleReload = async () => {
    setReloading(true)

    await reloadIndex()

    setReloading(false)
  }

  return (
    <main class="w-full h-full py-4 md:py-20">
      <section class="container mx-auto">
        <span class="w-full inline-flex rounded-md justify-end mx-2 md:mx-0">
          <button
            type="button"
            classList={{
              'inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500':
                true,
              'opacity-20': reloading()
            }}
            onclick={() => handleReload()}
            disabled={reloading()}
          >
            Reload Index
          </button>
        </span>

        <section class="mt-4 mx-2 md:mx-0">
          <label for="search" class="block text-sm font-medium text-gray-700">
            Search term
          </label>
          <div class="mt-1">
            <input
              type="search"
              name="search"
              id="search"
              class="shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={searchTerm()}
              oninput={(e) => setSearchTerm(e.currentTarget.value)}
            />
          </div>
        </section>

        <div class="mx-2 md:mx-0 flex flex-col py-2 text-sm font-medium text-indigo-600">
          <span>Results: {searchResult().hits}</span>
          <span>Took: {searchResult().took} ms</span>
        </div>

        <div class="overflow-hidden sm:rounded-md mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <For each={searchResult().books}>
            {(item) => <BookCard {...item} />}
          </For>
        </div>
      </section>
    </main>
  )
}

const BookCard = (item: TBook) => {
  return (
    <div
      class="block hover:bg-gray-50 cursor-pointer shadow w-full"
      onclick={() => setOpenCard((prev) => (prev === item.id ? null : item.id))}
    >
      <div class="px-4 py-4 sm:px-6 w-full h-full">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-indigo-600 truncate">
            {item.name}
          </p>
          <div class="ml-2 flex-shrink-0 flex">
            <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {item.genre}
            </p>
          </div>
        </div>

        <div class="mt-2 sm:flex sm:justify-between">
          <div class="sm:flex">
            <p class="flex items-center text-sm text-gray-500">
              {item.author} - ({item.year})
            </p>
          </div>
        </div>

        <Show when={openCard() === item.id}>
          <section class="mt-2 border-t border-gray-200 flex flex-col gap-1">
            <div class="flex items-center justify-between text-sm text-gray-500 mt-2">
              <span>Price</span>
              <span>
                {item.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
              </span>
            </div>

            <div class="flex items-center justify-between text-sm text-gray-500 ">
              <span>Rating</span>
              <span>{item.user_rating}</span>
            </div>

            <div class="flex items-center justify-between text-sm text-gray-500 ">
              <span>Qty. Reviews</span>
              <span>{item.reviews}</span>
            </div>
          </section>
        </Show>
      </div>
    </div>
  )
}

export default App
