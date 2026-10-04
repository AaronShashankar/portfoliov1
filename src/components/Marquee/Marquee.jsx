import React from 'react'
import { MARQUEE_ROWS } from '../../data/content'
import styles from './Marquee.module.css'

export default function Marquee() {
  // Duplicate items 4 times to guarantee seamless infinite scrolling loop
  const row1Repeated = [...MARQUEE_ROWS.row1, ...MARQUEE_ROWS.row1, ...MARQUEE_ROWS.row1, ...MARQUEE_ROWS.row1]
  const row2Repeated = [...MARQUEE_ROWS.row2, ...MARQUEE_ROWS.row2, ...MARQUEE_ROWS.row2, ...MARQUEE_ROWS.row2]

  return (
    <div
      className={styles.marqueeSection}
      aria-hidden="true"
    >
      {/* Row 1: Scrolling Left */}
      <div className={styles.rowWrapper}>
        <div className={`${styles.rowTrack} ${styles.scrollLeft}`}>
          {row1Repeated.map((item, idx) => (
            <span key={`r1-${idx}`} className={styles.wordItem}>
              <span
                className={`${styles.text} ${
                  item.outlined ? styles.textOutlined : styles.textSolid
                }`}
              >
                {item.text}
              </span>
              <span className={styles.separator}>
                <span className={styles.diamond} />
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Row 2: Scrolling Right */}
      <div className={styles.rowWrapper}>
        <div className={`${styles.rowTrack} ${styles.scrollRight}`}>
          {row2Repeated.map((item, idx) => (
            <span key={`r2-${idx}`} className={styles.wordItem}>
              <span
                className={`${styles.text} ${
                  item.outlined ? styles.textOutlined : styles.textSolid
                }`}
              >
                {item.text}
              </span>
              <span className={styles.separator}>
                <span className={`${styles.diamond} ${styles.diamondCyan}`} />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
