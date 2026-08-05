import { siteConfig } from '@/shared/config/site'
import { Container } from '@/shared/ui'
import styles from '../privacy-policy/PrivacyPolicy.module.scss'

const LAST_UPDATED = 'July 5, 2026'

export function TermsEn() {
  return (
    <Container>
      <article className={styles.article}>
        <header className={styles.header}>
          <p className={styles.label}>[ Legal Information ]</p>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the {siteConfig.url}{' '}
            website and its content (the &quot;Website&quot;), operated by {siteConfig.legalName}{' '}
            (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By accessing or using the Website you
            agree to be bound by these Terms. If you do not agree, please do not use the Website.
          </p>
        </header>

        <section>
          <h2>Use of the Website</h2>
          <p>
            The Website is provided for general information about our tokenomics consulting,
            audit, and research services. You agree to use it only for lawful purposes and not to
            disrupt, damage, or attempt to gain unauthorized access to the Website or its
            infrastructure.
          </p>
        </section>

        <section>
          <h2>Intellectual property</h2>
          <p>
            All content on the Website — text, articles, audits, research, graphics, logos, and
            layout — is owned by or licensed to {siteConfig.legalName} and is protected by
            applicable intellectual-property laws. You may read and share links to our content and
            quote it with attribution and a link back, but you may not republish substantial
            portions or present it as your own without our prior written permission.
          </p>
        </section>

        <section>
          <h2>No investment or financial advice</h2>
          <p>
            Nothing on the Website is financial, investment, legal, or tax advice, an offer, or a
            solicitation to buy or sell any token, security, or other asset. Tokenomics audits,
            ratings, and articles are our professional opinion for informational purposes only and
            may become outdated. Crypto assets are volatile and high-risk. You are solely
            responsible for your own decisions and should seek independent professional advice.
          </p>
        </section>

        <section>
          <h2>Third-party links</h2>
          <p>
            The Website may link to third-party sites and data sources (for example DefiLlama,
            CoinGecko, exchanges). We do not control and are not responsible for their content,
            accuracy, or availability.
          </p>
        </section>

        <section>
          <h2>Disclaimer of warranties</h2>
          <p>
            The Website and its content are provided &quot;as is&quot; and &quot;as available&quot;,
            without warranties of any kind, whether express or implied, including accuracy,
            completeness, fitness for a particular purpose, or uninterrupted availability.
          </p>
        </section>

        <section>
          <h2>Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, {siteConfig.legalName} shall not be liable for
            any indirect, incidental, or consequential loss, or any loss of profits, data, or
            opportunity, arising from your use of, or reliance on, the Website or its content.
          </p>
        </section>

        <section>
          <h2>Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. The current version is always available at
            this page, with the &quot;Last updated&quot; date above. Continued use of the Website
            after changes take effect constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2>Governing law</h2>
          <p>
            These Terms are governed by the laws of the United Arab Emirates, without regard to
            conflict-of-law rules. Disputes shall be subject to the competent courts of Dubai, UAE.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these Terms? Email{' '}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or use our{' '}
            <a href="/contact">contact page</a>. {siteConfig.legalName}, {siteConfig.address}.
          </p>
        </section>
      </article>
    </Container>
  )
}
