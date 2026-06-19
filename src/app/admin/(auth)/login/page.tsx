import LoginForm from "@/features/admin/auth/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="rounded border border-gray-300 bg-white p-6">
      <h1 className="mb-1 text-xl font-semibold text-gray-900">Admin login</h1>
      <p className="mb-6 text-sm text-gray-600">Sign in to access the admin panel</p>
      <LoginForm />
    </div>
  );
}
