import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MAX_POKEMON_ID } from '../api/pokeapi'
import { DetailHero } from '../components/detail/DetailHero'
import { EvolutionChain } from '../components/detail/EvolutionChain'
import { InfoPanel } from '../components/detail/InfoPanel'
import { PrevNextNav } from '../components/detail/PrevNextNav'
import { StatBars } from '../components/detail/StatBars'
import { Tabs } from '../components/detail/Tabs'
import { ErrorState } from '../components/ErrorState'
import { useEvolutionChain, usePokemon, usePokemonList, useSpecies } from '../hooks/queries'
import { formatName } from '../utils/format'
import { typeInfo } from '../utils/typeColors'
import { NotFound } from './NotFound'

function BackButton() {
  const navigate = useNavigate()
  const canGoBack = ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0
  const className =
    'self-start rounded-full px-2 py-1 text-sm font-semibold text-poke-red hover:underline focus-visible:outline-3 focus-visible:outline-poke-red'
  return canGoBack ? (
    <button type="button" onClick={() => navigate(-1)} className={className}>
      ← Volver
    </button>
  ) : (
    <Link to="/" className={className}>
      ← Volver
    </Link>
  )
}

function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="flex animate-pulse flex-col gap-4">
      <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}

function DetailView({ id }: { id: number }) {
  const pokemon = usePokemon(id)
  const species = useSpecies(id)
  const evolution = useEvolutionChain(species.data?.evolutionChainId)
  const { data: list } = usePokemonList()

  useEffect(() => window.scrollTo({ top: 0 }), [id])

  if (pokemon.isError) return <ErrorState onRetry={() => pokemon.refetch()} />
  if (pokemon.isPending) return <DetailSkeleton />

  const p = pokemon.data
  const name = species.data?.localName || formatName(p.name)
  const accent = typeInfo(p.types[0]).color

  const tabs = [
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
    <>
      <title>{`${name} · Pokédex`}</title>
      <DetailHero pokemon={p} name={name} genus={species.data?.genus} />
      <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900/60 dark:ring-white/10">
        <Tabs tabs={tabs} accent={accent} />
      </section>
      <PrevNextNav prev={list?.find((x) => x.id === id - 1)} next={list?.find((x) => x.id === id + 1)} />
    </>
  )
}

export function Detail() {
  const id = Number(useParams().id)
  if (!Number.isInteger(id) || id < 1 || id > MAX_POKEMON_ID) return <NotFound />

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-4">
      <BackButton />
      <DetailView key={id} id={id} />
    </article>
  )
}
