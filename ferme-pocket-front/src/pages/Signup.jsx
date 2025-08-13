import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import authService from '../services/authService';

// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
  nom: Yup.string()
    .min(2, 'Trop court!')
    .max(50, 'Trop long!')
    .required('Le nom est requis'),
  prenom: Yup.string()
    .min(2, 'Trop court!')
    .max(50, 'Trop long!')
    .required('Le prénom est requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('L\'email est requis'),
  telephone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Numéro de téléphone invalide')
    .required('Le téléphone est requis'),
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'
    )
    .required('Le mot de passe est requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation')
});

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setServerError('');
      setIsSubmitting(true);
      
      // Préparer les données pour l'API
      const userData = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        telephone: values.telephone,
        password: values.password,
        role: 'user' // Par défaut, on définit le rôle comme 'user'
      };

      // Appel au service d'authentification
      await authService.register(userData);
      
      // Inscription réussie
      setIsSuccess(true);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Gestion des erreurs du serveur
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          if (data.error === 'Email already exists') {
            setFieldError('email', 'Cet email est déjà utilisé');
          } else if (data.error === 'Phone already exists') {
            setFieldError('telephone', 'Ce numéro de téléphone est déjà utilisé');
          } else {
            setServerError('Une erreur est survenue lors de l\'inscription');
          }
        } else {
          setServerError('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
      } else {
        setServerError('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Si l'inscription est réussie, afficher un message de succès
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Inscription réussie !</h1>
          <p className="text-gray-600 mb-6">Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.</p>
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-blue-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full">
        {/* En-tête */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à l'accueil
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-600 mt-2">Rejoignez notre communauté dès maintenant</p>
        </div>

        {/* Affichage des erreurs serveur */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>{serverError}</p>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <Formik
          initialValues={{
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting: formikIsSubmitting }) => (
            <Form className="space-y-5">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                    Prénom *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="text"
                      id="prenom"
                      name="prenom"
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.prenom && touched.prenom ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <ErrorMessage name="prenom" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div className="space-y-1">
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom *
                  </label>
                  <Field
                    type="text"
                    id="nom"
                    name="nom"
                    className={`block w-full px-3 py-2 border ${errors.nom && touched.nom ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Votre nom"
                  />
                  <ErrorMessage name="nom" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.email && touched.email ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="votre@email.com"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Téléphone */}
              <div className="space-y-1">
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                  Téléphone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="tel"
                    id="telephone"
                    name="telephone"
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.telephone && touched.telephone ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="0601020304"
                  />
                </div>
                <ErrorMessage name="telephone" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Mot de passe */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`block w-full pl-10 pr-10 py-2 border ${errors.password && touched.password ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Confirmation mot de passe */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`block w-full pl-10 pr-10 py-2 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Conditions d'utilisation */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Field
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                    J'accepte les{' '}
                    <a href="/conditions" className="text-blue-600 hover:text-blue-800">
                      conditions d'utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="/confidentialite" className="text-blue-600 hover:text-blue-800">
                      politique de confidentialité
                    </a>{' '}
                    *
                  </label>
                  <ErrorMessage name="acceptTerms" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {/* Bouton de soumission */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || formikIsSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting || formikIsSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                >
                  {isSubmitting || formikIsSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Inscription en cours...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Lien vers la page de connexion */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
