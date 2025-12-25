import PropTypes from 'prop-types'

import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from '@reach/listbox'
import { VisuallyHidden } from 'radix-ui'

import { ChevronDownIcon } from '@heroicons/react/solid'

import '@reach/listbox/styles.css'

function FilterListBox({ regions, selectedRegion, onFilterChanged }) {
  return (
    <>
      <VisuallyHidden.Root id="region-filter-label">
        Filter by Region
      </VisuallyHidden.Root>
      <ListboxInput
        name="region"
        defaultValue={selectedRegion}
        value={selectedRegion}
        onChange={onFilterChanged}
        required={true}
      >
        <ListboxButton
          aria-labelledby="region-filter-label"
          arrow={<ChevronDownIcon className="chevron-icon" />}
        >
          {regions[selectedRegion]}
        </ListboxButton>
        <ListboxPopover portal={false}>
          <ListboxList>
            {Object.keys(regions)
              .sort()
              .map((region) => (
                <ListboxOption
                  key={region}
                  value={region}
                  label={regions[region]}
                >
                  {regions[region]}
                </ListboxOption>
              ))}
          </ListboxList>
        </ListboxPopover>
      </ListboxInput>
    </>
  )
}

FilterListBox.propTypes = {
  regions: PropTypes.object.isRequired,
  selectedRegion: PropTypes.string.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
}

export default FilterListBox
