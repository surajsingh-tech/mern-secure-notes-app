import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {  BookA, CheckCircle, Lock, LogOut, Smartphone, User, Zap } from "lucide-react";
import { Link, useNavigate  } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getData } from "@/context/userContext";
import axios from "axios";
import { toast } from "sonner";

const accessToken = localStorage.getItem('accessToken');
console.log('accessToken',accessToken)
export default function Horo() {
  const {user,setUser} = getData()
  const navigate = useNavigate()
  const logoutHandler=async()=>{
    try {
      const res = await axios.post('http://localhost:8000/api/v1/user/logout',{},{
    headers:{
      Authorization : `Bearer ${accessToken}` 
    }
  }) 
  if(res.data.success)
  {
    setUser(null)
    toast.success(res.data.message)
    localStorage.clear()
    navigate('/login')
  }
    } catch (error) {
      console.log("error is",error);
    }
  }
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="flex flex-wrap justify-between items-center p-4 border-b mx-10">
        <h1 className="text-lg sm:text-xl font-bold">Notes App</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0">
          <ul className="flex gap-7 items-center text-lg font-semibold">
            <li>Features</li>
            <li>Pricing</li>
            <li>About</li>
            {user ? (
              <>
                <DropdownMenu >
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuItem> <User/> Profile</DropdownMenuItem>
                      <DropdownMenuItem><BookA/> Notes</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logoutHandler} ><LogOut/> Logout</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to={"/login"}>
                <li>
                  <Button className="w-full sm:w-auto">Login</Button>
                </li>
              </Link>
            )}
          </ul>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-16 sm:py-20 px-4 sm:px-6 lg:px-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Organize your day, securely.
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-xl">
          A modern todo app with authentication, built for speed and simplicity.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6 lg:px-12 pb-16 sm:pb-20">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <CardTitle>Smart Todos</CardTitle>
          </CardHeader>
          <CardContent>Manage tasks with ease and clarity.</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-500" />
            <CardTitle>Secure Auth</CardTitle>
          </CardHeader>
          <CardContent>
            JWT-based authentication with email verification.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-purple-500" />
            <CardTitle>Responsive</CardTitle>
          </CardHeader>
          <CardContent>Works seamlessly across devices.</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            <CardTitle>Fast & Real-time</CardTitle>
          </CardHeader>
          <CardContent>Instant updates with modern backend.</CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t p-4 text-center text-xs sm:text-sm text-muted-foreground">
        © {new Date().getFullYear()} Notes TodoAuth. All rights reserved.
      </footer>
    </main>
  );
}
