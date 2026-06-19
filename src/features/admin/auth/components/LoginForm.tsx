'use client';

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions/login";

const initialState: LoginState = {};

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    return (
        <form action={formAction} className="space-y-4">
            {state.error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {state.error}
                </p>
            )}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-red-600 text-white rounded-lg py-2 font-medium hover:bg-red-700 disabled:opacity-50"
                >
                {isPending ? 'Signing in…' : 'Sign in'}
            </button>
        </form>
    )
}