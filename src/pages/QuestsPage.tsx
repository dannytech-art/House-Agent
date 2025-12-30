import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Award } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ChallengeProgressCard } from '../components/ChallengeProgressCard';
import { mockAgent } from '../utils/mockData';
export function QuestsPage() {
  const challenges = mockAgent.challenges || [];
  return <div className="min-h-screen bg-bg-secondary pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            Agent Quests
          </h1>
          <p className="text-text-secondary">
            Complete challenges to earn XP, credits, and badges.
          </p>
        </div>

        {challenges.length > 0 ? <div className="space-y-6">
            <section>
              <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Active Challenges
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {challenges.filter(c => !c.completed).map((challenge, index) => <motion.div key={challenge.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }}>
                      <ChallengeProgressCard challenge={challenge} />
                    </motion.div>)}
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                Completed
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {challenges.filter(c => c.completed).length > 0 ? challenges.filter(c => c.completed).map(challenge => <ChallengeProgressCard key={challenge.id} challenge={challenge} />) : <div className="col-span-full p-8 text-center bg-bg-primary rounded-xl border border-border-color border-dashed">
                    <p className="text-text-tertiary">
                      No completed quests yet. Keep going!
                    </p>
                  </div>}
              </div>
            </section>
          </div> : <EmptyState icon={Award} title="No Active Quests" description="Check back later for new challenges and opportunities to earn rewards." />}
      </div>
    </div>;
}