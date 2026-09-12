"use client";

import React from "react";
import { Activity } from "lucide-react";
import { mockActivities } from "@/data/dashboard";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface DashboardActivity {
  id: string;
  message: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities?: DashboardActivity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const prefersReduced = useReducedMotion();
  const displayActivities = activities && activities.length > 0 ? activities : (activities ? [] : mockActivities);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: prefersReduced ? 0 : -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6 select-none flex flex-col justify-between">
      {/* Title block */}
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-sm font-serif font-medium tracking-wider text-white">
          Recent Activity
        </h3>
      </div>

      {/* Timeline wrapper or Empty State */}
      {displayActivities.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <Activity size={24} className="mx-auto text-white/20" />
          <p className="text-xs text-white/40 font-sans">No recent activity logged.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          className="relative pl-4 space-y-6 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[1px] before:bg-white/5"
        >
          {displayActivities.map((act) => (
            <motion.div
              key={act.id}
              variants={itemVariants}
              className="relative space-y-1 group"
            >
              {/* Timeline Dot Indicator */}
              <span className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-primary/40 border border-black group-hover:bg-primary transition-colors duration-300" />

              {/* Content text */}
              <p className="text-sm font-sans text-white/80 group-hover:text-white transition-colors duration-200 leading-normal">
                {act.message}
              </p>
              
              {/* Timestamp description */}
              <span className="text-xs text-white/60 font-sans tracking-wide block font-medium">
                {act.timestamp}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

