
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { User, Settings, LogOut } from "lucide-react";

export function UserMenuSheet() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Avatar className="cursor-pointer border border-purple-400">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-purple-600 text-white">U</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="bg-[#11172d] border-l border-purple-900 text-white">
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-3 pb-6 border-b border-purple-800">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-purple-600">U</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Usuário Admin</h3>
              <p className="text-sm text-purple-300">admin@exemplo.com</p>
            </div>
          </div>
          
          <nav className="py-6 flex-1">
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-purple-900/50"
                >
                  <User className="mr-3 h-4 w-4" />
                  Meu Perfil
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-purple-900/50"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Configurações
                </Button>
              </li>
            </ul>
          </nav>
          
          <div className="pt-4 border-t border-purple-800">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}