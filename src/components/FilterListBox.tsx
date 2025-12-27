import { Select, VisuallyHidden } from 'radix-ui'

import { ChevronDownIcon } from '@heroicons/react/20/solid'

type FilterListBoxProps = {
  regions: Record<string, string>
  selectedRegion: string
  onFilterChanged: (region: string) => void
}

function FilterListBox({
  regions,
  selectedRegion,
  onFilterChanged,
}: FilterListBoxProps) {
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

export default FilterListBox
