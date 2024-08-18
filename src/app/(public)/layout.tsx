export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>){
    return (
        <main>
            <div className="flex justify-center items-center h-screen">
                { children }
            </div>
        </main>
    )
}