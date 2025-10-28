'use client';


import { Suspense } from "react"
import TaskList from "@/components/task-list"
import TaskListSkeleton from "@/components/task-list-skeleton"
import AiRecommendations from "@/components/ai-recommendations"
import { ThemeToggle } from "@/components/theme-toggle"

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b">
//         <div className="container flex h-16 items-center justify-between">
//           <h1 className="text-2xl font-bold">AI Task Manager</h1>
//           <ThemeToggle />
//         </div>
//       </header>
//       <main className="container py-6">
//         <div className="grid gap-6 md:grid-cols-3">
//           <div className="md:col-span-2">
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
//               <Suspense fallback={<TaskListSkeleton />}>
//                 <TaskList />
//               </Suspense>
//             </div>
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
//             <AiRecommendations />
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }




import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // In a real app, you would use cookies or localStorage to maintain auth state
  // For this simple demo, we're just simulating a logged-in status
  useEffect(() => {
    // Check if user info exists in localStorage (would be set during login)
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Invalid stored data, redirect to login
        router.push('/login');
      }
    } else {
      // No user data found, redirect to login
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Show loading state while checking auth
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">AI Task Manager</h1>
          <div className="">
            <button onClick={handleLogout} className="text-sm mr-5 border-white border-solid hover:underline">
              Logout
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
              <Suspense fallback={<TaskListSkeleton />}>
                <TaskList />
              </Suspense>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">AI Recommendations</h2>
            <AiRecommendations />
          </div>
        </div>
      </main>
    </div>
  );
}