import React from 'react';
import { Check } from 'lucide-react';

export const CheckoutSteps = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, title: 'Cart Review' },
    { number: 2, title: 'Shipping' },
    { number: 3, title: 'Payment' },
    { number: 4, title: 'Order Review' },
    { number: 5, title: 'Place Order' },
  ];

  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step indicator circle & label */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-600/20'
                      : isCurrent
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-4 ring-indigo-600/20 scale-110'
                      : 'border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.number}
                </div>
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-semibold text-center whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 -mt-5 bg-slate-200 dark:bg-slate-800 relative">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-500"
                    style={{
                      width: step.number < currentStep ? '100%' : '0%',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
