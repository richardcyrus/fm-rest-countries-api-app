import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import BorderCountryButton from '~/components/BorderCountryButton'
import { countryQueryOptions } from '~/queries/countries'
import { COUNTRY_CODE_PATTERN } from '~/utils/countryCode'

export const Route = createFileRoute('/details/$code')({
  loader: async ({ context, params }) => {
    if (!COUNTRY_CODE_PATTERN.test(params.code)) {
      throw notFound()
    }
    const result = await context.queryClient.ensureQueryData(
      countryQueryOptions(params.code)
    )
    if (!result) {
      throw notFound()
    }
  },
  component: Details,
})

function Details() {
  const { code } = Route.useParams()
  const { data } = useSuspenseQuery(countryQueryOptions(code))

  if (!data) {
    return null
  }
  const { detail: country, borders } = data

  return (
    <main role="main" id="main-content" className="country-detail-content">
      <div className="nav-container">
        <Link to="/" className="button nav-button">
          <ArrowLeftIcon className="back-arrow-icon" />
          Back
        </Link>
      </div>
      <div className="detail-wrapper">
        <div id="flag-container" className="flag-container">
          <img
            src={country.flag}
            alt={`Flag of ${country.name}`}
            className="large-flag"
            loading="lazy"
            width={560}
          />
        </div>
        <div className="country-data">
          <h2 className="country-name">{country.name}</h2>
          <div className="country-facts">
            <dl className="fact-group-left" id="fact-group-left">
              <div className="fact-group">
                <dt className="fact-label">Native Name</dt>
                <dd className="fact-value">{country.nativeName}</dd>
              </div>
              <div className="fact-group">
                <dt className="fact-label">Population</dt>
                <dd className="fact-value">{country.population}</dd>
              </div>
              <div className="fact-group">
                <dt className="fact-label">Region</dt>
                <dd className="fact-value">{country.region}</dd>
              </div>
              <div className="fact-group">
                <dt className="fact-label">Sub Region</dt>
                <dd className="fact-value">{country.subregion}</dd>
              </div>
              {country.capital ? (
                <div className="fact-group">
                  <dt className="fact-label">Capital</dt>
                  <dd className="fact-value">{country.capital}</dd>
                </div>
              ) : null}
            </dl>
            <dl className="fact-group-right" id="fact-group-right">
              <div className="fact-group">
                <dt className="fact-label">Top Level Domain</dt>
                <dd className="fact-value">{country.topLevelDomain}</dd>
              </div>
              {country.currencies ? (
                <div className="fact-group">
                  <dt className="fact-label">Currencies</dt>
                  <dd className="fact-value">{country.currencies}</dd>
                </div>
              ) : null}
              <div className="fact-group">
                <dt className="fact-label">Languages</dt>
                <dd className="fact-value">{country.languages}</dd>
              </div>
            </dl>
          </div>
          {borders.length > 0 ? (
            <div className="border-countries">
              <h3 className="border-countries-title">Border Countries:</h3>
              {borders.map((border) => (
                <BorderCountryButton
                  key={border.cca3}
                  code={border.cca3}
                  name={border.name}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
