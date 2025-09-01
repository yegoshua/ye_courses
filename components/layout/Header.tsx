'use client';

import { useState } from 'react';
import { Menu, X, User, LogOut, BookOpen, ShoppingBag, Play } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { logout } from '@/lib/store/slices/authSlice';
import { openAuthForm } from '@/lib/store/slices/uiSlice';
import { selectIsAuthenticated, selectUser, selectOwnedCourses } from '@/lib/store/selectors';

export function Header() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const ownedCourses = useAppSelector(selectOwnedCourses);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    dispatch(openAuthForm('login'));
  };

  const handleRegister = () => {
    dispatch(openAuthForm('register'));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const NavigationItems = () => (
    <>
      <Link 
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
        onClick={() => setMobileMenuOpen(false)}
      >
        All Courses
      </Link>
      {isAuthenticated && (
        <Link 
          href="/my-courses"
          className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Play className="h-4 w-4" />
          My Courses
          {ownedCourses.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {ownedCourses.length}
            </Badge>
          )}
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">EduPlatform</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <NavigationItems />
            </nav>
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm">
                        {user ? getUserInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm">
                        {user ? getUserInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-courses" className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      My Courses
                      {ownedCourses.length > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {ownedCourses.length}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleLogin}>
                  Sign In
                </Button>
                <Button onClick={handleRegister}>
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    EduPlatform
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    <NavigationItems />
                  </nav>

                  {/* Mobile Auth Section */}
                  <div className="border-t pt-6">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {user ? getUserInitials(user.name) : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        {/* Mobile Menu Items */}
                        <div className="space-y-2">
                          <Link
                            href="/my-courses"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="flex items-center gap-2">
                              <Play className="h-4 w-4" />
                              <span>My Courses</span>
                            </div>
                            {ownedCourses.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {ownedCourses.length}
                              </Badge>
                            )}
                          </Link>
                          
                          <Link
                            href="/"
                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </div>

                        {/* Logout Button */}
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full justify-start gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          onClick={handleLogin} 
                          className="w-full"
                        >
                          Sign In
                        </Button>
                        <Button 
                          onClick={handleRegister} 
                          className="w-full"
                        >
                          Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}