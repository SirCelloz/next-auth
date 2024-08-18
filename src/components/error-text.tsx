export default function ErrorText ({ label }: { label: string[] | string }) {
    return (
        <p className="text-sm text-red-500">
            { label }
        </p>
    )
}