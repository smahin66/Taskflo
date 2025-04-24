import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Calendar, Tag, ArrowRight, Check, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  {
    icon: CheckCircle,
    title: 'Gestion des tâches intuitive',
    description: 'Organisez vos tâches facilement avec une interface moderne et intuitive'
  },
  {
    icon: Clock,
    title: 'Minuteur intégré',
    description: 'Suivez votre temps et restez productif avec notre minuteur intelligent'
  },
  {
    icon: Calendar,
    title: 'Vue hebdomadaire',
    description: 'Planifiez votre semaine efficacement avec notre vue calendrier'
  },
  {
    icon: Tag,
    title: 'Catégories personnalisées',
    description: 'Organisez vos tâches avec des catégories colorées personnalisables'
  }
];

const pricingFeatures = [
  "Tâches illimitées",
  "Catégories personnalisées",
  "Vue hebdomadaire",
  "Minuteur intégré",
  "Statistiques avancées",
  "Support prioritaire",
  "Thèmes personnalisés",
  "Exportation des données"
];

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent dark:from-blue-900/20 dark:via-purple-900/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-blue-500 dark:bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Organisez votre journée{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                efficacement
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              TaskFlow vous aide à gérer vos tâches, suivre votre temps et rester productif avec une interface moderne et intuitive.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onGetStarted}
              className="group"
            >
              <span className="flex items-center">
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-dark-700">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
                    <span className="mr-2">✨</span>
                    Phase de lancement
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Offre spéciale de lancement !
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Les 50 premiers utilisateurs bénéficieront d'un accès gratuit à vie à TaskFlow ! Profitez de cette offre exclusive pendant notre phase de test.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Signaler un bug : <a href="mailto:smahin.salmi@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">smahin.salmi@gmail.com</a>
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">50</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tout ce dont vous avez besoin pour rester organisé
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Des fonctionnalités puissantes pour une gestion de tâches efficace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-dark-700 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Un prix unique pour toutes les fonctionnalités
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Accédez à toutes les fonctionnalités pour un prix abordable
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-8 text-center border-b border-gray-100 dark:border-dark-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Premium
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">1,99€</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">/mois</span>
                </div>
              </div>

              <div className="p-8">
                <ul className="space-y-4">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 dark:text-green-400 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={onGetStarted}
                  fullWidth
                  className="mt-8"
                >
                  Commencer maintenant
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;