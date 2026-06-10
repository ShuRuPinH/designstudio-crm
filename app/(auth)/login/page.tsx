import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Designstudio</h1>
            <p className="mt-1 text-sm text-gray-500">CRM для отдела продаж</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
