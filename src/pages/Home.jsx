import Header from '../components/Header'
import FilterBar from '../components/FilterBar/FilterBar'
import Card from '../components/Card'

import styles from '../styles/Home.module.scss'

function Home() {
  return (
    <div>
      <Header />
      <FilterBar />
      <div className={styles.cardContainer}>
        <Card />
      </div>
    </div>
  )
}

export default Home
