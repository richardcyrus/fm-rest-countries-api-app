import PropTypes from 'prop-types'

import { SearchIcon } from '@heroicons/react/outline'
import { VisuallyHidden } from '@reach/visually-hidden'

import styles from './FilterInput.module.scss'

function FilterInput({ searchCountryName, onInputChanged }) {
  return (
    <>
      <label className={styles.controlGroup}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          name="search-text"
          placeholder="Search for a country..."
          id="searchInput"
          className={styles.searchInput}
          value={searchCountryName}
          onChange={onInputChanged}
          data-test="search-input"
        />
        <VisuallyHidden>Search for a country</VisuallyHidden>
      </label>
    </>
  )
}

FilterInput.propTypes = {
  searchCountryName: PropTypes.string.isRequired,
  onInputChanged: PropTypes.func.isRequired,
}

export default FilterInput
