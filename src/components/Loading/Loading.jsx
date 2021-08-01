import styles from './Loading.module.scss'

function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  )
}

export default Loading
