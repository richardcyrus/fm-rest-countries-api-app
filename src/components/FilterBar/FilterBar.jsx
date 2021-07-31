import FilterInput from './FilterInput'
import FilterListBox from './FilterListBox'

import styles from './FilterBar.module.scss'

function FilterBar(props) {
  return (
    <div className={styles.filterBar}>
      <FilterInput
        searchCountryName={props.searchCountryName}
        handleChange={props.handleChange}
      />
      <FilterListBox />
    </div>
  )
}

export default FilterBar
