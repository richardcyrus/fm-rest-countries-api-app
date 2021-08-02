import PropTypes from 'prop-types'

import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import styles from './FilterListBox.module.scss'

const regions = [
  { type: 'region', name: 'Africa', value: 'africa', unavailable: false },
  { type: 'region', name: 'Americas', value: 'americas', unavailable: false },
  { type: 'region', name: 'Asia', value: 'asia', unavailable: false },
  { type: 'region', name: 'Europe', value: 'europe', unavailable: false },
  { type: 'region', name: 'Oceania', value: 'oceania', unavailable: false },
  { type: 'region', name: 'Polar', value: 'polar', unavailable: false },
]

function FilterListBox({ selectedRegion, onFilterChanged }) {
  return (
    <Listbox
      as="div"
      className={styles.listBox}
      value={selectedRegion}
      onChange={onFilterChanged}
      data-test="listbox"
    >
      <Listbox.Button className={styles.button} data-test="listbox-button">
        {selectedRegion.name}
        <ChevronDownIcon className={styles.icon} />
      </Listbox.Button>
      <div className={styles.listOptionsContainer}>
        <Listbox.Options>
          {regions.map((region, i) => (
            <Listbox.Option
              key={i}
              value={region}
              disabled={region.unavailable}
              className={({ active }) => `${active ? styles.active : ''}`}
              data-test="listbox-option"
            >
              {region.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}

FilterListBox.propTypes = {
  selectedRegion: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    unavailable: PropTypes.bool.isRequired,
  }).isRequired,
  onFilterChanged: PropTypes.func.isRequired,
}

export default FilterListBox
