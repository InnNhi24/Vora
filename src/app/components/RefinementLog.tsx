/**
 * Display refinement loop iterations and feedback
 */

interface RefinementIteration {
  iteration: number;
  feedback: string;
  timestamp: string;
  success: boolean;
}

interface RefinementLogProps {
  iterations: RefinementIteration[];
}

export function RefinementLog({ iterations }: RefinementLogProps) {
  if (iterations.length === 0) {
    return (
      <div className="text-center text-zinc-400 py-8">
        No refinement iterations yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {iterations.map((iter) => (
        <div
          key={iter.iteration}
          className={`p-4 rounded-lg border ${
            iter.success
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-zinc-700">
              Iteration {iter.iteration}
            </span>
            <span className="text-xs text-zinc-500">{iter.timestamp}</span>
          </div>
          <div className="text-sm text-zinc-600">{iter.feedback}</div>
          <div className="mt-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                iter.success
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {iter.success ? 'Success' : 'Needs Refinement'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
