# Countries Browser

A web app for browsing countries of the world: finding them by name or region and viewing facts about each one, including the neighbours it borders.

## Language

**Country**:
A sovereign entity described by the countries data source, identified by its alpha-3 code.
_Avoid_: Nation, state

**Country Summary**:
The short view of a Country shown on a card in the browse list and on a Border Country button.
_Avoid_: Card (the card is how a Summary is displayed, not the thing itself)

**Country Detail**:
The full view of a single Country shown on its own page.
_Avoid_: Profile, full country

**Region**:
A continent-level grouping of Countries, with a display label and a URL-safe slug.
_Avoid_: Continent

**Border Country**:
A Country that shares a land border with the Country being viewed.
_Avoid_: Neighbour, adjacent country
