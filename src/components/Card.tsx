import { Link } from 'react-router'

import { VisuallyHidden } from 'radix-ui'

type CardProps = {
  flag: string
  name: string
  alpha3Code: string
  capital?: string
  region?: string
  population?: string
}

function Card({
  flag,
  name,
  alpha3Code,
  capital,
  region,
  population,
}: CardProps) {
  return (
    <>
      <div className="card">
        <VisuallyHidden.Root id={`country-card-${alpha3Code.toLowerCase()}`}>
          {name}
        </VisuallyHidden.Root>
        <div className="card-image">
          <Link
            to={`/details/${alpha3Code}`}
            title={name}
            className="card-link"
          >
            <img
              src={flag}
              width={264}
              alt={`Flag of ${name}`}
              className="card-flag"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="card-body">
          <Link to={`/details/${alpha3Code}`} className="card-link">
            <h2 className="country-name">{name}</h2>
            <dl className="card-facts">
              <div className="card-fact-group">
                <dt className="card-fact-label">Population</dt>
                <dd className="card-fact-value">{population}</dd>
              </div>
              <div className="card-fact-group">
                <dt className="card-fact-label">Region</dt>
                <dd className="card-fact-value">{region}</dd>
              </div>
              {capital && capital.length > 0 ? (
                <div className="card-fact-group">
                  <dt className="card-fact-label">Capital</dt>
                  <dd className="card-fact-value">{capital}</dd>
                </div>
              ) : null}
            </dl>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Card
