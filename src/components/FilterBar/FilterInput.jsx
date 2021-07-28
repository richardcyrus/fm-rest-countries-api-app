import { SearchIcon } from '@heroicons/react/outline'
import { VisuallyHidden } from '@reach/visually-hidden'

import styles from './FilterInput.module.scss'

function FilterInput() {
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
        />
        <VisuallyHidden>Search for a country</VisuallyHidden>
      </label>
    </>
  )
}

export default FilterInput
