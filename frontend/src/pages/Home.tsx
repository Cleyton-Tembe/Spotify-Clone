import { ScrollArea } from "../components/ui/scroll-area";
import NavBar from "../components/global/NavBar";

const Home = () => {
  return (
    <main className="rounded-md overflow-hidden h-full bg-linear-to-b from-zinc-800 to-zinc-900">
      <NavBar />
      <ScrollArea className="h-[calc(100vh-78px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good afternoon
          </h1>
          <div className="space-y-8"></div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default Home;
