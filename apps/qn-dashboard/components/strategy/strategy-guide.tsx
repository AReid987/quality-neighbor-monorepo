'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommentSection } from '@/components/comments/comment-section';
import { ChevronDown, ChevronUp, Users, Target, Zap } from 'lucide-react';

const phases = [
  {
    id: 'awareness',
    title: 'Phase 1: Awareness — The "Chamber of Commerce Hustle"',
    icon: Users,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'The initial goal is to build trust and generate buzz through authentic, grassroots efforts, not expensive ads. The research shows a clear distrust of generic advertising and a desire for genuine community connection.',
    tactics: [
      {
        id: 'chamber-hustle',
        title: 'The Chamber Hustle',
        actions: [
          'Join the Hartland Chamber of Commerce to get listed in their directory and gain access to member-only groups and events.',
          'Volunteer at Chamber events (e.g., farmers markets, local festivals) to network directly with residents and business owners.',
          'Engage in "Coffee Meetings" with local business owners to cross-promote and gather initial testimonials.'
        ],
        evidence: 'Your market analysis identified a need for trusted local commerce. Aligning with the Chamber immediately establishes credibility and provides free marketing channels to an engaged local audience of over 8,200 people. This is a low-cost, high-trust alternative to physical flyers, which have a high cost-per-signup and risk being perceived as spam.'
      },
      {
        id: 'social-infiltration',
        title: 'Strategic Social Media Infiltration',
        actions: [
          'Post on Nextdoor & Local Facebook Groups using the Problem-Agitate-Solution (PAS) framework.',
          'Post Example: "Problem: Tired of sifting through political rants on your feed just to find out about the new cafe? Agitate: You\'re missing out on the best parts of Hartland Ranch because they\'re buried in negativity. Solution: I\'m starting a free, monthly newsletter that\'s 100% positive news and local gems. No drama. Link in bio to get the first issue."',
          'Hijack relevant conversations. When someone asks for a recommendation, provide a helpful answer and then add, "I feature places like this in my free local newsletter, Quality Neighbor."'
        ],
        evidence: 'Your research found that the top complaints about existing platforms are toxic culture, negativity, and poor content quality. This messaging strategy directly positions Quality Neighbor as the antidote, addressing a documented, deeply felt pain point and turning their weakness into your strength.'
      }
    ]
  },
  {
    id: 'acquisition',
    title: 'Phase 2: Acquisition — The High-Conversion Landing Page',
    icon: Target,
    color: 'bg-green-50 text-green-700 border-green-200',
    description: 'Once a resident is aware, the goal is to convert them with a frictionless, value-driven sign-up experience. The landing page must instantly communicate its unique value and answer "What\'s in it for me?"',
    tactics: [
      {
        id: 'landing-page',
        title: 'Deploy the Optimized Landing Page',
        actions: [
          'Implement the landing page exactly as specified in the Final Implementation Prompt. This includes the finalized copy, visual style, and structure.'
        ],
        evidence: 'The entire landing page is a conversion machine built from your research. Every element, from the headline to the button text, was meticulously crafted and A/B tested in the planning documents to maximize sign-ups.'
      },
      {
        id: 'pain-aware-headline',
        title: 'Lead with a Pain-Aware Headline',
        actions: [
          'The primary headline, "Rediscover Hartland Ranch. (Without the Noise)," must be the most prominent element.'
        ],
        evidence: 'Research shows residents are "Pain Aware"—they feel the frustration of social media but aren\'t actively searching for a newsletter. This headline immediately validates their pain and hooks them by promising a solution, which is the most effective strategy for this audience.'
      },
      {
        id: 'local-proof',
        title: 'Build Trust with Hyper-Local Proof',
        actions: [
          'Display logos of local businesses gathered from the "Chamber Hustle" on the landing page.',
          'Feature a powerful testimonial from a real Hartland Ranch resident as soon as possible, including their name and photo.',
          'Add the trust signal "Join 500+ of your neighbors!" below the main call-to-action button.'
        ],
        evidence: 'For hyperlocal services, social proof from within the community is exponentially more powerful than generic endorsements. This builds instant credibility and reduces the perceived risk of signing up for something new.'
      },
      {
        id: 'frictionless-signup',
        title: 'Ensure a Frictionless Sign-Up',
        actions: [
          'The call-to-action is a simple, single-field form for an email address, with clear, anxiety-reducing microcopy like "100% free. Unsubscribe anytime with one click."'
        ],
        evidence: 'The blueprint emphasizes minimizing friction at the point of conversion. Every additional field you ask for will decrease the conversion rate. The goal is to make saying "yes" as easy as possible.'
      }
    ]
  },
  {
    id: 'activation',
    title: 'Phase 3: Activation & Value — The Concierge Community',
    icon: Zap,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Immense value comes from exceeding expectations. The newsletter shouldn\'t just be a static digest; it should be an active tool for community building that directly solves the problems your research uncovered.',
    tactics: [
      {
        id: 'zero-drama',
        title: 'Deliver a "Zero-Drama" Content Experience',
        actions: [
          'Curate content that is exclusively positive, useful, and 100% focused on Hartland Ranch.',
          'Actively avoid the top complaint themes from your research: political arguments, petty disputes, and fear-based alerts.',
          'Structure the newsletter to be a "5-minute read, once a month," respecting the reader\'s time.'
        ],
        evidence: 'The number one opportunity is to be everything existing platforms are not. By focusing on high-quality, positive content, you directly address the primary driver of user exodus from Nextdoor and Facebook Groups, creating a product that is inherently more valuable and enjoyable.'
      },
      {
        id: 'concierge-mvp',
        title: 'Launch a "Concierge MVP"',
        actions: [
          'Introduce a "Neighborly Needs" section in the newsletter. Ask subscribers if they need to borrow a tool, find a babysitter, or need help with a task.',
          'Manually connect subscribers who have complementary needs via email or a private WhatsApp group. Use a template like: "Hi [Name]! Your neighbor [3 houses down] also gardens. Want to borrow their tiller? Reply YES to connect!"'
        ],
        evidence: 'This transitions Quality Neighbor from a simple media product to a high-value hyperlocal service. Your analysis identified real-time service exchange and skill-sharing as a critical underserved need. This concierge service delivers tangible, immense value that a simple content feed cannot match, fostering deep user loyalty.'
      },
      {
        id: 'value-flywheel',
        title: 'Build a Flywheel of Value',
        actions: [
          'Feature a new local business in every issue, reinforcing the value for business-owning subscribers.',
          'Use testimonials from happy subscribers as social proof in the next newsletter issue, creating a self-reinforcing loop of community trust.',
          'Poll readers on what they\'d like to see next, ensuring the content remains hyper-relevant and co-created with the community.'
        ],
        evidence: 'This strategy turns the newsletter into a flywheel. Engaged residents provide value to local businesses (customers), who in turn support the newsletter (sponsorship), which allows you to create better content that engages more residents. This virtuous cycle is the engine for long-term, sustainable growth.'
      }
    ]
  }
];

export const StrategyGuide = () => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [expandedTactic, setExpandedTactic] = useState<string | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
    setExpandedTactic(null);
  };

  const toggleTactic = (tacticId: string) => {
    setExpandedTactic(expandedTactic === tacticId ? null : tacticId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-4">
          Quality Neighbor Newsletter Launch Strategy
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          This interactive guide outlines an evidence-backed strategy for launching the Quality Neighbor newsletter in Hartland Ranch, focusing on building awareness, driving sign-ups, and delivering immediate, immense value to the community.
        </p>
      </div>

      {phases.map((phase) => {
        const Icon = phase.icon;
        const isExpanded = expandedPhase === phase.id;
        
        return (
          <Card key={phase.id} className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden">
            <CardHeader 
              className={`cursor-pointer transition-all duration-200 ${phase.color}`}
              onClick={() => togglePhase(phase.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <CardTitle className="text-2xl font-bold">{phase.title}</CardTitle>
                </div>
                {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
              </div>
            </CardHeader>
            
            {isExpanded && (
              <CardContent className="p-6">
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {phase.description}
                </p>
                
                <div className="space-y-4">
                  {phase.tactics.map((tactic) => (
                    <Card key={tactic.id} className="bg-gray-50/50 border border-gray-200">
                      <CardHeader 
                        className="cursor-pointer bg-white/50 hover:bg-white/80 transition-colors"
                        onClick={() => toggleTactic(tactic.id)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {tactic.title}
                          </CardTitle>
                          {expandedTactic === tactic.id ? 
                            <ChevronUp className="h-5 w-5" /> : 
                            <ChevronDown className="h-5 w-5" />
                          }
                        </div>
                      </CardHeader>
                      
                      {expandedTactic === tactic.id && (
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Action Steps:</h4>
                              <ul className="space-y-2">
                                {tactic.actions.map((action, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <Badge variant="outline" className="mt-0.5 text-xs">
                                      {index + 1}
                                    </Badge>
                                    <span className="text-gray-700 text-sm">{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Evidence & Rationale:</h4>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {tactic.evidence}
                              </p>
                            </div>
                            
                            <CommentSection sectionId={tactic.id} />
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6">
                  <CommentSection sectionId={phase.id} />
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};