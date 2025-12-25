import PropTypes from 'prop-types'

import { VisuallyHidden, Select } from 'radix-ui'

import { ChevronDownIcon } from '@heroicons/react/solid'

function FilterListBox({ regions, selectedRegion, onFilterChanged }) {
  return (
    <>
      <VisuallyHidden.Root id="region-filter-label">
        Filter by Region
      </VisuallyHidden.Root>
      <Select.Root
        name="region"
        defaultValue={selectedRegion}
        value={selectedRegion}
        onValueChange={onFilterChanged}
        required={true}
        className="select-root"
      >
        <Select.Trigger
          aria-labelledby="region-filter-label"
          className="select-trigger"
        >
          <Select.Value placeholder={regions['default']}>
            {regions[selectedRegion]}
          </Select.Value>
          <Select.Icon className="select-icon">
            <ChevronDownIcon className="chevron-icon" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Content position="popper" className="select-content">
          <Select.Viewport className="select-viewport">
            {Object.keys(regions)
              .sort()
              .map((region) => (
                <Select.Item
                  key={region}
                  value={region}
                  data-label={region}
                  className="select-item"
                >
                  <Select.ItemText>{regions[region]}</Select.ItemText>
                </Select.Item>
              ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </>
  )
}

FilterListBox.propTypes = {
  regions: PropTypes.object.isRequired,
  selectedRegion: PropTypes.string.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
}

export default FilterListBox
