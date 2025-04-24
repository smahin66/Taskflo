import React, { createContext, useContext, useState } from 'react';

type Language = 'fr' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    'app.title': 'TaskFlow',
    'dashboard': 'Tableau de bord',
    'all_tasks': 'Toutes les tâches',
    'active': 'Actives',
    'completed': 'Terminées',
    'categories': 'Catégories',
    'settings': 'Paramètres',
    'add_task': 'Ajouter une tâche',
    'search': 'Rechercher',
    'profile': 'Profil',
    'sign_out': 'Se déconnecter',
    'update': 'Mettre à jour',
    'cancel': 'Annuler',
    'username': "Nom d'utilisateur",
    'email': 'Email',
    'language': 'Langue',
    'select_language': 'Sélectionner la langue',
    'sign_in': 'Se connecter',
    'sign_up': "S'inscrire",
    'password': 'Mot de passe',
    'confirm_password': 'Confirmer le mot de passe',
    'enter_email': 'Entrez votre email',
    'enter_password': 'Entrez votre mot de passe',
    'or_continue_with': 'Ou continuer avec',
    'already_have_account': 'Déjà un compte ? Se connecter',
    'no_account': "Pas de compte ? S'inscrire",
    'passwords_not_match': 'Les mots de passe ne correspondent pas',
    'password_min_length': 'Le mot de passe doit contenir au moins 6 caractères',
    'account_created': 'Compte créé avec succès !',
    'login_success': 'Connexion réussie !',
    'organize_efficiently': 'Organisez votre journée efficacement',
    'invalid_credentials': 'Email ou mot de passe incorrect',
    'invalid_email': 'Adresse email invalide',
    'network_error': 'Erreur de connexion au serveur',
    'unknown_error': 'Une erreur est survenue',
    'required_field': 'Ce champ est requis',
  },
  en: {
    'app.title': 'TaskFlow',
    'dashboard': 'Dashboard',
    'all_tasks': 'All Tasks',
    'active': 'Active',
    'completed': 'Completed',
    'categories': 'Categories',
    'settings': 'Settings',
    'add_task': 'Add Task',
    'search': 'Search',
    'profile': 'Profile',
    'sign_out': 'Sign Out',
    'update': 'Update',
    'cancel': 'Cancel',
    'username': 'Username',
    'email': 'Email',
    'language': 'Language',
    'select_language': 'Select language',
    'sign_in': 'Sign In',
    'sign_up': 'Sign Up',
    'password': 'Password',
    'confirm_password': 'Confirm Password',
    'enter_email': 'Enter your email',
    'enter_password': 'Enter your password',
    'or_continue_with': 'Or continue with',
    'already_have_account': 'Already have an account? Sign in',
    'no_account': "Don't have an account? Sign up",
    'passwords_not_match': 'Passwords do not match',
    'password_min_length': 'Password must be at least 6 characters long',
    'account_created': 'Account created successfully!',
    'login_success': 'Login successful!',
    'organize_efficiently': 'Organize your day efficiently',
    'invalid_credentials': 'Invalid email or password',
    'invalid_email': 'Invalid email address',
    'network_error': 'Network connection error',
    'unknown_error': 'An error occurred',
    'required_field': 'This field is required',
  },
  es: {
    'app.title': 'TaskFlow',
    'dashboard': 'Tablero',
    'all_tasks': 'Todas las tareas',
    'active': 'Activas',
    'completed': 'Completadas',
    'categories': 'Categorías',
    'settings': 'Ajustes',
    'add_task': 'Añadir tarea',
    'search': 'Buscar',
    'profile': 'Perfil',
    'sign_out': 'Cerrar sesión',
    'update': 'Actualizar',
    'cancel': 'Cancelar',
    'username': 'Nombre de usuario',
    'email': 'Correo electrónico',
    'language': 'Idioma',
    'select_language': 'Seleccionar idioma',
    'sign_in': 'Iniciar sesión',
    'sign_up': 'Registrarse',
    'password': 'Contraseña',
    'confirm_password': 'Confirmar contraseña',
    'enter_email': 'Introduce tu email',
    'enter_password': 'Introduce tu contraseña',
    'or_continue_with': 'O continuar con',
    'already_have_account': '¿Ya tienes una cuenta? Inicia sesión',
    'no_account': '¿No tienes cuenta? Regístrate',
    'passwords_not_match': 'Las contraseñas no coinciden',
    'password_min_length': 'La contraseña debe tener al menos 6 caracteres',
    'account_created': '¡Cuenta creada con éxito!',
    'login_success': '¡Inicio de sesión exitoso!',
    'organize_efficiently': 'Organiza tu día eficientemente',
    'invalid_credentials': 'Email o contraseña inválidos',
    'invalid_email': 'Dirección de correo inválida',
    'network_error': 'Error de conexión al servidor',
    'unknown_error': 'Ha ocurrido un error',
    'required_field': 'Este campo es requerido',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'fr';
  });

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};