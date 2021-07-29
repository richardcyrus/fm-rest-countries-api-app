import FilterBar from '../components/FilterBar/FilterBar'
import Card from '../components/Card'

import styles from '../styles/Home.module.scss'

function Home() {
  return (
    <>
      <main id="main-content">
        <FilterBar />
        <div className={styles.cardContainer}>
          <Card />
        </div>
      </main>
    </>
  )
}

export default Home
