import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, Shuffle, Scale, Shield, Users, Layers, HelpCircle, Lock } from 'lucide-react';

export const EditorialContent: React.FC = () => {
  return (
    <article className="mt-16 space-y-12 text-slate-700">
      {/* Section 1: The Core Value */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shuffle className="w-6 h-6 text-brand-600 shrink-0" />
          Why Use a Random Team Generator Over Manual Picking?
        </h2>
        <p className="leading-relaxed">
          Selecting groups manually often introduces social friction and anxiety—especially for those picked last. An automated random team generator eliminates favoritism entirely, giving every participant an equal mathematical probability of ending up on any given squad.
        </p>
        <p className="leading-relaxed">
          Whether organizing recreational sports, classroom workshops, or company hackathons, algorithmic team division ensures every match or project begins from a place of mutual trust and competitive fairness.
        </p>
      </section>

      {/* Section 2: Mathematical Rigor & Remainder Balancing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-6 h-6 text-brand-600 shrink-0" />
          The Mathematics of Fairness: Fisher-Yates &amp; Balanced Remainders
        </h2>
        <p className="leading-relaxed">
          Under the hood, our tool implements the benchmark Fisher-Yates (Knuth) shuffle algorithm in <code>O(n)</code> linear runtime. Unlike basic pseudo-random sorting hacks that introduce non-uniform skew, Fisher-Yates guarantees that all permutations remain statistically indistinguishable in likelihood.
        </p>
        <p className="leading-relaxed">
          In addition, our round-robin remainder distribution solves odd roster counts. When dividing 10 players into 3 squads, inferior tools often create lopsided allocations like 4, 4, and 2. Our algorithm guarantees squad sizes differ by at most one member (yielding 4, 3, and 3) for optimal game balance.
        </p>
      </section>

      {/* Section 3: Feature Comparison Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-6 h-6 text-brand-600 shrink-0" />
          Method Comparison: Digital Randomizer vs Traditional Picking
        </h2>

        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                <th className="p-4">Selection Technique</th>
                <th className="p-4">Speed &amp; Setup</th>
                <th className="p-4">Mathematical Fairness</th>
                <th className="p-4">Social Friction &amp; Bias</th>
                <th className="p-4">Share Ready</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr className="bg-brand-50/40">
                <td className="p-4 font-bold text-brand-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  Our Random Team Generator
                </td>
                <td className="p-4 text-emerald-700 font-medium">Instant (&lt; 1 sec)</td>
                <td className="p-4 text-emerald-700 font-medium">100% Unbiased Fisher-Yates</td>
                <td className="p-4 text-emerald-700 font-medium">Zero (Fully Automated)</td>
                <td className="p-4 text-emerald-700 font-medium">Yes (One-Click Copy &amp; PNG)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-800">Team Captains Picking</td>
                <td className="p-4">Slow (5-10 minutes)</td>
                <td className="p-4 text-rose-600">Poor (Subjective Bias)</td>
                <td className="p-4 text-rose-600">High (Chosen Last Stigma)</td>
                <td className="p-4">No</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-800">Drawing from a Hat</td>
                <td className="p-4">Tedious (Cutting Paper)</td>
                <td className="p-4">Fair if properly mixed</td>
                <td className="p-4">Low</td>
                <td className="p-4">No</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-800">Spreadsheet Formulas</td>
                <td className="p-4">Moderate (Needs Setup)</td>
                <td className="p-4">Fair but uneven remainders</td>
                <td className="p-4">Low</td>
                <td className="p-4">Cumbersome on mobile</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Practical Real-World Scenarios */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-600 shrink-0" />
          Primary Applications for Random Team Splitting
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="p-5 bg-white border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-base">Classroom &amp; Academic Groups</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Construct diverse study pods, lab partners, and debate squads without social cliques dominating discussions.
            </p>
          </Card>

          <Card className="p-5 bg-white border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-base">Recreational Sports &amp; Gym Pickups</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Organize weekly pickup soccer, 5-on-5 basketball, or volleyball directly on your phone with zero arguments before kickoff.
            </p>
          </Card>

          <Card className="p-5 bg-white border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-base">Corporate Workshops &amp; Hackathons</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mix colleagues across departments during agile sprints and team-building activities to spark cross-functional collaboration.
            </p>
          </Card>

          <Card className="p-5 bg-white border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-base">Video Games, Esports &amp; Board Games</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Divide players quickly for custom LAN matches, tabletop party games, or tournament scrims.
            </p>
          </Card>
        </div>
      </section>

      {/* Section 5: Advanced Features & Pro Strategies */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-brand-600 shrink-0" />
          Advanced Strategies: Skill Tiers, Locks &amp; Drag Adjustments
        </h2>
        <p className="leading-relaxed">
          Make the most of our advanced team management tools:
        </p>
        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-2.5 text-sm">
            <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span><strong>Multi-Tier Skill Balancing:</strong> Click &quot;Add Tier&quot; to divide players into skill brackets (e.g. Captains, Intermediates, Beginners). Each tier is shuffled and distributed evenly across squads to prevent unbalanced matchups.</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>Pin &amp; Lock Anchors:</strong> Hover over any player in a generated squad and click the lock icon. Pinned members stay fixed in their team and slot across unlimited reshuffles.</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm">
            <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span><strong>Interactive Drag &amp; Drop:</strong> Fine-tune rosters by dragging players between teams or moving unassigned names straight from the roster input into a squad.</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm">
            <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span><strong>One-Click PNG &amp; Text Export:</strong> Download high-res roster summary cards or copy formatted lists ready for Discord, Slack, and group chats.</span>
          </li>
        </ul>
      </section>

      {/* Section 6: Commitment to Privacy */}
      <section className="p-6 bg-slate-100/80 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span>Zero Server Tracking &amp; Total Data Privacy</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          All calculations and roster divisions run 100% locally in your web browser. Participant names are never stored, logged, or sent to any remote server.
        </p>
      </section>
    </article>
  );
};
