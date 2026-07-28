import * as React from 'react'

export interface ScentNotesProps {
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
}

export function ScentNotes({ topNotes, heartNotes, baseNotes }: ScentNotesProps) {
  return (
    <section className="py-12 border-t border-b border-white-500/20 my-12">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Olfactory Composition
        </span>
        <h2 className="font-cormorant text-heading-lg text-white-100 font-light">
          Scent Pyramid
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Top Notes */}
        <div className="bg-bg-surface border border-gold-300/20 p-6 text-center space-y-3">
          <span className="text-label text-gold-200 uppercase tracking-widest block">
            Top Notes
          </span>
          <p className="text-xs text-white-400 font-light">First impression (5–15 mins)</p>
          <div className="flex flex-wrap justify-center gap-1.5 pt-2">
            {topNotes.map((note) => (
              <span key={note} className="px-2 py-1 bg-bg-secondary text-xs text-white-200 border border-white-500/20">
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Heart Notes */}
        <div className="bg-bg-surface border border-gold-300/30 p-6 text-center space-y-3">
          <span className="text-label text-gold-300 uppercase tracking-widest block">
            Heart Notes
          </span>
          <p className="text-xs text-white-400 font-light">Core identity (15–60 mins)</p>
          <div className="flex flex-wrap justify-center gap-1.5 pt-2">
            {heartNotes.map((note) => (
              <span key={note} className="px-2 py-1 bg-bg-secondary text-xs text-white-100 border border-gold-300/30">
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Base Notes */}
        <div className="bg-bg-surface border border-gold-300/20 p-6 text-center space-y-3">
          <span className="text-label text-gold-200 uppercase tracking-widest block">
            Base Notes
          </span>
          <p className="text-xs text-white-400 font-light">Lingering trail (hours to weeks)</p>
          <div className="flex flex-wrap justify-center gap-1.5 pt-2">
            {baseNotes.map((note) => (
              <span key={note} className="px-2 py-1 bg-bg-secondary text-xs text-white-200 border border-white-500/20">
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
