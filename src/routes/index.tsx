import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { VisuallyHidden } from 'radix-ui'
import { useEffect, useRef, useState } from 'react'
import Card from '~/components/Card'
import FilterListBox from '~/components/FilterListBox'
import Loading from '~/components/Loading'
import useDebounce from '~/hooks/useDebounce'
import { countriesQueryOptions, regionsQueryOptions } from '~/queries/countries'
import { homeSearchSchema } from '~/utils/homeSearch'

const DEFAULT_REGION = 'default'

export const Route = createFileRoute('/')({
  validateSearch: homeSearchSchema,
  loaderDeps: ({ search: { q, region } }) => ({ q, region }),
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(regionsQueryOptions),
      context.queryClient.ensureInfiniteQueryData(countriesQueryOptions(deps)),
    ])
  },
  component: Home,
})

function Home() {
  const { q, region } = Route.useSearch()
  const navigate = Route.useNavigate()

  const [searchText, setSearchText] = useState(q ?? '')
  const debouncedText = useDebounce(searchText)

  useEffect(() => {
    const next = debouncedText.trim() || undefined
    if (next !== q) {
      void navigate({ search: (prev) => ({ ...prev, q: next }), replace: true })
    }
    // Only a settled search box should navigate, not a changed URL.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText])

  const { data: regionList } = useSuspenseQuery(regionsQueryOptions)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(countriesQueryOptions({ q, region }))

  const regions: Record<string, string> = {
    [DEFAULT_REGION]: 'Filter by Region',
    ...Object.fromEntries(regionList.map((r) => [r.slug, r.label])),
  }

  const onFilterChanged = (slug: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        region: slug === DEFAULT_REGION ? undefined : slug,
      }),
    })
  }

  const sentinel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = sentinel.current
    if (!node || !hasNextPage) {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '400px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const countries = data.pages.flatMap((page) => page.items)

  return (
    <main id="main-content" className="main-content" role="main">
      <div className="filter-bar">
        <label className="control-group">
          <VisuallyHidden.Root>Search for a country</VisuallyHidden.Root>
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            name="search-text"
            placeholder="Search for a country..."
            id="search-country"
            className="search-input"
            value={searchText}
            onChange={(evt) => setSearchText(evt.target.value)}
          />
        </label>
        <div className="region-filter">
          <FilterListBox
            regions={regions}
            selectedRegion={region ?? DEFAULT_REGION}
            onFilterChanged={onFilterChanged}
          />
        </div>
      </div>
      {countries.length === 0 ? (
        <p className="no-results" role="status">
          No countries found.
        </p>
      ) : (
        <div className="card-container">
          {countries.map((country) => (
            <Card key={country.cca3} {...country} />
          ))}
        </div>
      )}
      {hasNextPage ? <div ref={sentinel} aria-hidden="true" /> : null}
      {isFetchingNextPage ? <Loading /> : null}
    </main>
  )
}
