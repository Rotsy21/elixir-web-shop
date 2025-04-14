
import { ArrowRight, CheckCircle2, Award, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* Hero section */}
      <section className="bg-primary/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Notre histoire
            </h1>
            <p className="text-lg text-gray-700 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Depuis 2010, Elixir Drinks vous propose les meilleures boissons artisanales et rafraîchissantes, 
              préparées avec passion et des ingrédients de qualité.
            </p>
            <Button onClick={() => navigate("/contact")} className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Contactez-nous <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Story section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="/placeholder.svg"
                alt="Notre fondateur"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Comment tout a commencé</h2>
              <p className="text-gray-700 mb-4">
                Tout a commencé dans la petite cuisine de notre fondateur, passionné par les saveurs et les boissons de qualité.
                L'idée était simple : créer des boissons qui sont à la fois délicieuses, saines et respectueuses de l'environnement.
              </p>
              <p className="text-gray-700 mb-4">
                Après des années d'expérimentation et de perfectionnement de nos recettes, nous avons ouvert notre premier atelier en 2010.
                Depuis, nous n'avons cessé de grandir, mais notre philosophie reste la même : qualité, authenticité et durabilité.
              </p>
              <p className="text-gray-700">
                Aujourd'hui, Elixir Drinks est reconnu pour ses boissons innovantes qui allient tradition et modernité, 
                toujours avec ce souci du détail qui fait notre réputation.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos valeurs</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Ces principes guident chacune de nos actions et décisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Qualité</h3>
              <p className="text-gray-600 text-center">
                Nous sélectionnons rigoureusement nos ingrédients et contrôlons 
                chaque étape de notre processus de production pour garantir des produits d'excellence.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Innovation</h3>
              <p className="text-gray-600 text-center">
                Nous explorons constamment de nouvelles saveurs et combinaisons
                pour proposer des boissons uniques qui surprennent et ravissent.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Durabilité</h3>
              <p className="text-gray-600 text-center">
                De l'approvisionnement à l'emballage, nous nous engageons à minimiser
                notre impact environnemental et à promouvoir des pratiques durables.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre équipe</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Des passionnés qui travaillent chaque jour pour vous offrir le meilleur
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Placeholder team members */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="mb-4 relative">
                  <img
                    src="/placeholder.svg"
                    alt={`Team Member ${i}`}
                    className="w-40 h-40 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Membre de l'équipe {i}</h3>
                <p className="text-gray-500 mb-2">Poste / Fonction</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Ce que nos clients disent</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src="/placeholder.svg"
                  alt="Client"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Client Satisfait</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Les boissons d'Elixir Drinks sont incroyables. Je les recommande vivement, 
                leur qualité est incomparable et les saveurs sont uniques."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src="/placeholder.svg"
                  alt="Client"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Client Fidèle</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "J'achète leurs produits depuis des années et je n'ai jamais été déçu. 
                La qualité est constante et le service client est exceptionnel."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src="/placeholder.svg"
                  alt="Client"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Nouveau Client</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "J'ai découvert Elixir Drinks récemment et je suis déjà conquis. 
                Leurs boissons sont rafraîchissantes et naturelles, exactement ce que je cherchais."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
