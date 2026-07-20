import { LivePip } from "./UI";

// Signature element: faint terracing-step texture behind the live scoreboard.
export function Scoreboard({ match }) {
  return (
    <div className="relative overflow-hidden rounded-cardLg border border-terracing/40 bg-night-pitch text-floodlight">
      <div className="absolute inset-0 bg-terracing-steps pointer-events-none" aria-hidden="true" />
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <LivePip />
          <span className="font-mono text-xs tracking-[0.1em] text-amber-live">
            {match.status} {match.minute}
          </span>
        </div>

        <Row name={match.home.name} score={match.home.score} />
        <div className="my-4 h-px bg-terracing/40" />
        <Row name={match.away.name} score={match.away.score} />
      </div>
    </div>
  );
}

function Row({ name, score }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-display font-bold uppercase leading-none text-3xl max-w-[70%] text-balance">
        {name}
      </span>
      <span className="font-mono font-bold text-5xl tabular-nums leading-none">
        {score}
      </span>
    </div>
  );
}

// Dense data uses a plain hard grid — no card wrapper, no color coding.
export function LeagueTable({ rows }) {
  return (
    <table className="w-full border-collapse font-mono text-xs">
      <thead>
        <tr className="text-left text-night-pitch dark:text-floodlight">
          <Th>Rank</Th>
          <Th>Team</Th>
          <Th className="text-right">Played</Th>
          <Th className="text-right">Goal</Th>
          <Th className="text-right">Points</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.rank} className="text-terracing">
            <Td>{r.rank}</Td>
            <Td className="text-night-pitch dark:text-floodlight">{r.team}</Td>
            <Td className="text-right">{r.played}</Td>
            <Td className="text-right">{r.gd}</Td>
            <Td className="text-right text-night-pitch dark:text-floodlight">
              {r.points}
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`border border-terracing/40 px-2 py-1.5 font-medium ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return (
    <td className={`border border-terracing/40 px-2 py-1.5 ${className}`}>
      {children}
    </td>
  );
}
