
import { Card } from '@/app/ui/home/cards';
import Search from '@/app/ui/search';
import CompleteWeather from '../../ui/completeWeather';
import { lusitana } from "../../ui/fonts";


export default async function Page() {

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Home
      </h1>
        <CompleteWeather />
    </main>
  );
}