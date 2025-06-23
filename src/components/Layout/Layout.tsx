import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-border bg-card/50">
          <Sidebar />
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 lg:mr-80 min-h-[calc(100vh-4rem)] mt-16">
          <div className="container mx-auto px-4 py-6 max-w-2xl">
            <Outlet />
          </div>
        </main>
        
        {/* Right Sidebar */}
        <aside className="hidden lg:block w-80 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-border bg-card/50">
          <RightSidebar />
        </aside>
      </div>
    </div>
  )
}

export default Layout
