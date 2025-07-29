// src/components/dashboard/recent-sales.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  const sales = [
    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+R$1.999,00" },
    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+R$39,00" },
    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+R$299,00" },
    { name: "William Kim", email: "will@email.com", amount: "+R$99,00" },
    { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+R$1.299,00" },
  ];

  return (
    <div className="space-y-6">
      {sales.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9 border border-purple-500">
            <AvatarImage src={`/avatars/0${index+1}.png`} alt="Avatar" />
            <AvatarFallback className="bg-purple-600 text-white">
              {sale.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium text-white">{sale.name}</p>
            <p className="text-sm text-purple-300">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium text-green-400">{sale.amount}</div>
        </div>
      ))}
    </div>
  );
}