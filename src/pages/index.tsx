import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />"
      wrapperClassName={styles.homeLayout}>
      <main className={styles.mainContainer}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroSubtitle}>
            <Translate
              id="homepage.hero.subtitle"
              description="The homepage hero subtitle">
              开发者友好的文档中心，一站式解决您的技术文档需求
            </Translate>
          </p>
        </div>
        
        <div className={styles.cardsContainer}>
          <Link to="https://koin.openaidoc.org" className={clsx(styles.card, styles.koinCard)} data-aos="fade-up" data-aos-delay="100">
            <div className={styles.cardContent}>
              <div>
                <h2 className={styles.cardTitle}>Koin</h2>
                <p className={styles.cardDescription}>
                  <Translate
                    id="homepage.card.koin.description"
                    description="Description of Koin framework">
                    轻量级的依赖注入框架，为Kotlin应用设计
                  </Translate>
                </p>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardTag}>
                  <Translate id="homepage.card.koin.tag.di">DI</Translate>
                </span>
                <span className={styles.cardTag}>
                  <Translate id="homepage.card.koin.tag.kotlin">Kotlin</Translate>
                </span>
              </div>
              <div className={styles.cardIcon}></div>
            </div>
          </Link>
          
          <Link to="https://kotlin.openaidoc.org" className={clsx(styles.card, styles.kotlinCard)} data-aos="fade-up" data-aos-delay="200">
            <div className={styles.cardContent}>
              <div>
                <h2 className={styles.cardTitle}>Kotlin</h2>
                <p className={styles.cardDescription}>
                  <Translate
                    id="homepage.card.kotlin.description"
                    description="Description of Kotlin language">
                    现代、简洁且安全的编程语言
                  </Translate>
                </p>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardTag}>
                  <Translate id="homepage.card.kotlin.tag.language">语言</Translate>
                </span>
                <span className={styles.cardTag}>
                  <Translate id="homepage.card.kotlin.tag.crossplatform">跨平台</Translate>
                </span>
              </div>
              <div className={styles.cardIcon}></div>
            </div>
          </Link>
          
          <Link to="https://ktor.openaidoc.org" className={clsx(styles.card, styles.ktorCard)} data-aos="fade-up" data-aos-delay="300">
            <div className={styles.cardContent}>
              <div className={styles.comingSoonBadge}>
                <Translate id="homepage.badge.comingSoon">敬请期待</Translate>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Ktor</h2>
                <p className={styles.cardDescription}>
                  <Translate
                    id="homepage.card.ktor.description"
                    description="Description of Ktor framework">
                    为Kotlin打造的异步Web框架
                  </Translate>
                </p>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardTag}>
                  <Translate id="homepage.card.ktor.tag.web">Web</Translate>
                </span>
                <span className={styles.cardTag}>
                  <Translate id="homepage.card.ktor.tag.async">异步</Translate>
                </span>
              </div>
              <div className={styles.cardIcon}></div>
            </div>
          </Link>
          
          <Link to="https://sqldelight.openaidoc.org" className={clsx(styles.card, styles.sqldelightCard)} data-aos="fade-up" data-aos-delay="400">
            <div className={styles.cardContent}>
              <div className={styles.comingSoonBadge}>
                <Translate id="homepage.badge.comingSoon">敬请期待</Translate>
              </div>
              <div>
                <h2 className={styles.cardTitle}>SQLDelight</h2>
                <p className={styles.cardDescription}>
                  <Translate
                    id="homepage.card.sqldelight.description"
                    description="Description of SQLDelight">
                    从SQL语句生成类型安全的Kotlin代码
                  </Translate>
                </p>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardTag}>
                  <Translate id="homepage.card.sqldelight.tag.sql">SQL</Translate>
                </span>
                <span className={styles.cardTag}>
                  <Translate id="homepage.card.sqldelight.tag.database">数据库</Translate>
                </span>
              </div>
              <div className={styles.cardIcon}></div>
            </div>
          </Link>
        </div>
        
        <div className={styles.footerBanner}>
          <div className={styles.bannerContent}>
            <h2 className={styles.bannerTitle}>
              <Translate id="homepage.banner.title">
                开始探索文档
              </Translate>
            </h2>
            <p className={styles.bannerDescription}>
              <Translate id="homepage.banner.description">
                选择上方任一技术栈，开始探索详尽的文档和示例
              </Translate>
            </p>
          </div>
        </div>
        
        <div className={styles.adBanner}>
          <div className={styles.adContentVertical}>
            <img src="https://2bab-images.lastmayday.com/binarytape-logo.webp?imageslim" alt="BinaryTape Logo" className={styles.adLogo} />
            <div className={styles.adInfo}>
              <h3 className={styles.adTitle}>
                <Link to="https://binarytape.com">BinaryTape</Link>
              </h3>
              <p className={styles.adDescription}>
                <Link to="https://binarytape.com">BinaryTape</Link> <Translate
                  id="homepage.ad.description"
                  description="Description of BinaryTape company">
                  通过创新咨询和解决方案连接全球与亚洲技术社区，利用我们在移动基础设施和新兴人工智能领域的专业知识，促进全球范围内的开源协作。
                </Translate>
              </p>
              <p className={styles.adContact}>
                <Translate
                  id="homepage.ad.contact"
                  description="Contact information for BinaryTape">
                  联系：hi@binarytape.com
                </Translate>
              </p>
              <p className={styles.adSponsor}>
                <Translate
                  id="homepage.ad.sponsor"
                  description="Sponsorship information">
                  OpenDocs 由 BinaryTape 赞助支持
                </Translate>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
