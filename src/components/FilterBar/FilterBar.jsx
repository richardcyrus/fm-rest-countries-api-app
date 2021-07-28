import FilterInput from './FilterInput'
import FilterListBox from './FilterListBox'

import styles from './FilterBar.module.scss'

function FilterBar() {
  return (
    <div className={styles.filterBar}>
      <FilterInput />
      <FilterListBox />
    </div>
  )
}

export default FilterBar
