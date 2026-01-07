import Sidebar from "@/components/partials/sidebar";
import PageRouter from "./PageRouter";
import { useUser } from "@/contexts/UserContext";

function MainLayout() {
  const { user } = useUser();

  return (
    <section className="min-h-screen w-full flex bg-[#FFF5E4]">
      {user && <Sidebar />}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1">
          <PageRouter />
        </div>
      </div>
    </section>
  );
}

export default MainLayout;
