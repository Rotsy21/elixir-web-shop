
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, CreditCard, Truck } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ShippingAddress } from "@/models/types";

// Schema de validation
const checkoutSchema = z.object({
  fullName: z.string().min(3, "Nom complet requis"),
  addressLine1: z.string().min(5, "Adresse requise"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Ville requise"),
  state: z.string().min(2, "État/Région requis"),
  postalCode: z.string().min(4, "Code postal requis"),
  country: z.string().min(2, "Pays requis"),
  paymentMethod: z.enum(["card", "paypal", "bank_transfer"], {
    required_error: "Veuillez sélectionner un mode de paiement",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getTotalItems, getTotalPrice } = useCart();
  const { createOrder } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form initialization
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.username || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "France",
      paymentMethod: "card",
    },
  });

  // Handle checkout
  const handleCheckout = async (values: CheckoutFormValues) => {
    if (!user) {
      toast.error("Vous devez être connecté pour finaliser votre commande");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Votre panier est vide");
      navigate("/products");
      return;
    }

    setIsProcessing(true);

    const shippingAddress: ShippingAddress = {
      fullName: values.fullName,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
    };

    let paymentMethodName;
    switch (values.paymentMethod) {
      case "card":
        paymentMethodName = "Carte bancaire";
        break;
      case "paypal":
        paymentMethodName = "PayPal";
        break;
      case "bank_transfer":
        paymentMethodName = "Virement bancaire";
        break;
      default:
        paymentMethodName = values.paymentMethod;
    }

    try {
      const order = await createOrder(shippingAddress, paymentMethodName);
      
      if (order) {
        toast.success("Votre commande a été créée avec succès!");
        navigate("/user/orders");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error("Une erreur est survenue lors de la finalisation de votre commande");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-16 w-16 mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">Ajoutez des produits pour commencer vos achats</p>
          <Button asChild>
            <a href="/products">Voir nos produits</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-16 w-16 mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Connectez-vous pour finaliser votre commande</h1>
          <p className="text-muted-foreground mb-6">Vous devez être connecté pour passer une commande</p>
          <Button onClick={() => navigate('/login', { state: { redirectTo: '/checkout' } })}>
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Finaliser la commande</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Adresse de livraison</CardTitle>
              <CardDescription>Saisissez l'adresse où vous souhaitez être livré</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form id="checkout-form" onSubmit={form.handleSubmit(handleCheckout)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Rue de Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complément d'adresse (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Appartement, étage, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Paris" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>État/Région</FormLabel>
                          <FormControl>
                            <Input placeholder="Île-de-France" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <Input placeholder="75001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un pays" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="Belgique">Belgique</SelectItem>
                              <SelectItem value="Suisse">Suisse</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Méthode de paiement</CardTitle>
              <CardDescription>Sélectionnez comment vous souhaitez payer</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="card" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                <div className="flex items-center">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Carte bancaire
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <FormLabel className="font-normal">PayPal</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bank_transfer" />
                              </FormControl>
                              <FormLabel className="font-normal">Virement bancaire</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>
                {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="flex-1">
                      {item.quantity} x {item.product.name}
                    </span>
                    <span className="font-medium">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{getTotalPrice().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{getTotalPrice().toFixed(2)} €</span>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                <p>Livraison estimée: 3-5 jours ouvrables</p>
                <p className="mt-1">
                  <Truck className="inline-block h-3 w-3 mr-1" />
                  Livraison gratuite à partir de 50€ d'achat
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
              >
                {isProcessing ? "Traitement en cours..." : "Commander"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
