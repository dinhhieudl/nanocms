'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function SuccessAnimation() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <CheckCircle2 className="h-20 w-20 mx-auto text-green-500 mb-6" />
    </motion.div>
  );
}
