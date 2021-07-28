import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import styles from './FilterListBox.module.scss'

const regions = [
  { id: 0, name: 'Filter by Region', value: 'default', unavailable: true },
  { id: 1, name: 'Africa', value: 'africa', unavailable: false },
  { id: 2, name: 'Americas', value: 'americas', unavailable: false },
  { id: 3, name: 'Asia', value: 'asia', unavailable: false },
  { id: 4, name: 'Europe', value: 'europe', unavailable: false },
  { id: 5, name: 'Oceania', value: 'oceania', unavailable: false },
]

function FilterListBox() {
  const [selectedRegion, setSelectedRegion] = useState(regions[0])

  return (
    <Listbox
      as="div"
      className={styles.listBox}
      value={selectedRegion}
      onChange={setSelectedRegion}
    >
      <Listbox.Button className={styles.button}>
        {selectedRegion.name}
        <ChevronDownIcon className={styles.icon} />
      </Listbox.Button>
      <div className={styles.listOptionsContainer}>
        <Listbox.Options>
          {regions.map((region) => (
            <Listbox.Option
              key={region.id}
              value={region}
              disabled={region.unavailable}
              className={({ active }) => `${active ? styles.active : ''}`}
            >
              {region.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}

export default FilterListBox
