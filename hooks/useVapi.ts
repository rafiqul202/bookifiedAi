import { IBook } from "@/type";
import { useAuth } from "@clerk/nextjs";

export const useVapi = (book: IBook) => {
  const { userId} = useAuth();
  
}