import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MAX_POKEMON_ID } from '../api/pokeapi'
import { DetailHero } from '../components/detail/DetailHero'
import { EvolutionChain } from '../components/detail/EvolutionChain'
import { InfoPanel } from '../components/detail/InfoPanel'
import { PrevNextNav } from '../components/detail/PrevNextNav'
import { StatBars } from '../components/detail/StatBars'
import { Tabs, type TabItem } from '../components/detail/Tabs'
import { ErrorState } from '../components/ErrorState'
import { ArrowLeftIcon } from '../components/icons'
import { useEvolutionChain, usePokemon, usePokemonList, useSpecies } from '../hooks/queries'
import { DESKTOP_QUERY, useMediaQuery } from '../hooks/useMediaQuery'
import { formatName } from '../utils/format'
import { typeInfo } from '../utils/typeColors'
import { NotFound } from './NotFound'

const panel =
  'rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-5 dark:bg-slate-900/60 dark:ring-white/10'

function BackButton() {
  const navigate = useNavigate()
  const canGoBack = ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0
  const className =
    'inline-flex h-10 items-center gap-1.5 self-start rounded-full pr-4 pl-3 text-sm font-semibold ring-1 ring-slate-900/10 transition hover:bg-white focus-visible:outline-3 focus-visible:outline-poke-red dark:ring-white/15 dark:hover:bg-slate-800'
  const content = (
    <>
      <ArrowLeftIcon size={18} />
      Volver
    </>
  )
  return canGoBack ? (
    <button type="button" onClick={() => navigate(-1)} className={className}>
      {content}
    </button>
  ) : (
    <Link to="/" className={className}>
      {content}
    </Link>
  )
}

function DetailSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando"
      className="grid animate-pulse gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
    >
      <div className="h-96 rounded-3xl bg-slate-200 lg:h-[34rem] dark:bg-slate-800" />
      <div className="flex flex-col gap-4">
        <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-56 rounded-3xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  )
}

/** En escritorio: secciones apiladas (todo visible). En móvil: tabs. */
function DetailSections({ sections, accent }: { sections: TabItem[]; accent: string }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  if (!isDesktop) {
    return (
      <section className={panel}>
        <Tabs tabs={sections} accent={accent} />
      </section>
    )
  }
  return sections.map((s) => (
    <section key={s.id} aria-labelledby={`sec-${s.id}`} className={panel}>
      <h2
        id={`sec-${s.id}`}
        className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400"
      >
        <span aria-hidden="true" className="h-4 w-1 rounded-full" style={{ backgroundColor: accent }} />
        {s.label}
      </h2>
      {s.content}
    </section>
  ))
}

function DetailView({ id }: { id: number }) {
  const pokemon = usePokemon(id)
  const species = useSpecies(id)
  const evolution = useEvolutionChain(species.data?.evolutionChainId)
  const { data: list } = usePokemonList()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [id])

  if (pokemon.isError) return <ErrorState onRetry={() => pokemon.refetch()} />
  if (pokemon.isPending) return <DetailSkeleton />

  const p = pokemon.data
  const name = species.data?.localName || formatName(p.name)
  const accent = typeInfo(p.types[0]).color

  const sections: TabItem[] = [
    { id: 'info', label: 'Info', content: <InfoPanel pokemon={p} species={species.data} /> },
    { id: 'stats', label: 'Stats', content: <StatBars stats={p.stats} /> },
    {
      id: 'evo',
      label: 'Evolución',
      content: evolution.data ? (
        <EvolutionChain chain={evolution.data} currentId={id} />
      ) : (
        <div className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      ),
    },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-6">
      <title>{`${name} · Pokédex`}</title>
      <div className="lg:sticky lg:top-20">
        <DetailHero pokemon={p} name={name} genus={species.data?.genus} />
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <DetailSections sections={sections} accent={accent} />
        <PrevNextNav
          prev={list?.find((x) => x.id === id - 1)}
          next={list?.find((x) => x.id === id + 1)}
        />
      </div>
    </div>
  )
}

export function Detail() {
  const id = Number(useParams().id)
  if (!Number.isInteger(id) || id < 1 || id > MAX_POKEMON_ID) return <NotFound />

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-4 lg:max-w-6xl">
      <BackButton />
      <DetailView key={id} id={id} />
    </article>
  )
}
