import { ImageResponse } from 'next/og'
import {
  decodeAnswers,
  evaluate,
} from '@/shared/lib/platform/diagnostic/scoring'
import { decodeModel } from '@/shared/lib/platform/tokenlab/urlState'
import { computeStructureScore } from '@/shared/lib/platform/tokenlab/scoringV3'
import { calcUnlockPressure12m } from '@/shared/lib/platform/tokenlab/pressure'
import { t } from '@/shared/i18n'

export const runtime = 'edge'

function Frame({
  children,
  footer,
}: {
  children: React.ReactNode
  footer: string
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 64,
        color: '#fff',
        backgroundColor: '#050308',
        backgroundImage:
          'radial-gradient(800px 400px at 80% -10%, rgba(194,78,136,0.35), transparent 65%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
          {[16, 26, 36].map((height) => (
            <span
              key={height}
              style={{ width: 8, height, backgroundColor: '#fff' }}
            />
          ))}
        </div>
        <span style={{ fontSize: 32, fontWeight: 700 }}>8Blocks</span>
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        {children}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 24,
          color: 'rgba(255,255,255,0.42)',
          borderTop: '1px solid rgba(255,255,255,0.14)',
          fontSize: 22,
        }}
      >
        <span>{footer}</span>
        <span>free · no signup · 8blocks.io</span>
      </div>
    </div>
  )
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const type = params.get('t')
  const modelParam = params.get('m')

  if (type === 'calc') {
    const model = modelParam ? decodeModel(modelParam) : null
    if (model) {
      const result = computeStructureScore(model.allocations, model.vestings)
      const pressure = calcUnlockPressure12m(
        model.allocations,
        model.vestings,
        model.totalSupply,
      )
      return new ImageResponse(
        <Frame footer="Tokenomics Calculator · Structure Score">
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 64,
            }}
          >
            <div
              style={{
                display: 'flex',
                maxWidth: 700,
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.42)',
                  fontSize: 26,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                {model.symbol ? `$${model.symbol}` : 'TOKEN MODEL'}
              </span>
              <span style={{ fontSize: 66, fontWeight: 600, lineHeight: 1.05 }}>
                {model.name || 'Tokenomics model'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: 26 }}>
                12m unlock pressure · {pressure.toFixed(1)}%
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                width: 260,
                height: 260,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                border: '10px solid #c24e88',
                borderRadius: '50%',
              }}
            >
              <span style={{ fontSize: 86, fontWeight: 700 }}>
                {result.score}
              </span>
              <span
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: 18,
                  letterSpacing: 2,
                }}
              >
                STRUCTURE SCORE
              </span>
            </div>
          </div>
        </Frame>,
        { width: 1200, height: 630 },
      )
    }

    return new ImageResponse(
      <Frame footer="Tokenomics Calculator · Structure Score">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.08 }}>
            {t({
              ru: 'Найдите риски в токеномике до запуска.',
              en: 'Catch tokenomics risks before launch.',
            })}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.66)', fontSize: 30 }}>
            {t({
              ru: 'Распределение · вестинг · Structure Score · PDF',
              en: 'Allocations · vesting · Structure Score · PDF',
            })}
          </span>
        </div>
      </Frame>,
      { width: 1200, height: 630 },
    )
  }

  const answersParam = params.get('a')
  const answers = answersParam ? decodeAnswers(answersParam) : null

  if (answers) {
    const result = evaluate(answers)
    return new ImageResponse(
      <Frame footer="Tokenization Readiness Assessment">
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.42)',
              fontSize: 30,
              letterSpacing: 4,
            }}
          >
            [ VERDICT ]
          </span>
          <span style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.05 }}>
            {result.verdict.name}
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {result.pillars.map((pillar) => (
              <div
                key={pillar.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: '14px 20px',
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <span style={{ fontSize: 18, textTransform: 'uppercase' }}>
                  {pillar.key}
                </span>
                <span style={{ color: '#e84690', fontSize: 30 }}>
                  {pillar.score}/{pillar.max}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Frame>,
      { width: 1200, height: 630 },
    )
  }

  return new ImageResponse(
    <Frame footer="Tokenization Readiness Assessment">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <span style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.08 }}>
          Can digitizing your assets widen your investor base?
        </span>
        <span style={{ color: 'rgba(255,255,255,0.66)', fontSize: 30 }}>
          Seven questions. One honest verdict.
        </span>
      </div>
    </Frame>,
    { width: 1200, height: 630 },
  )
}
