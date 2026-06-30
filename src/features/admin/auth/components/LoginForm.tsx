'use client';

import { useActionState, useId } from "react";
import { loginAction, type LoginState } from "../actions/login";
import {
  Alert,
  Button,
  FormField,
  Input,
  formButtonClassName,
} from "@/shared/components/ui";

const initialState: LoginState = {};

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);
    const errorId = useId();
    const hasError = Boolean(state.error);

    return (
        <form action={formAction} className="space-y-4" aria-label="Admin sign in">
            {hasError && (
                <Alert id={errorId}>{state.error}</Alert>
            )}
            <FormField
                label="Email"
                id="email"
                invalid={hasError}
                describedBy={hasError ? errorId : undefined}
            >
                <Input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                />
            </FormField>
            <FormField
                label="Password"
                id="password"
                invalid={hasError}
                describedBy={hasError ? errorId : undefined}
            >
                <Input
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                />
            </FormField>

            <Button type="submit" loading={isPending} className={formButtonClassName}>
                {isPending ? 'Signing in…' : 'Sign in'}
            </Button>
        </form>
    )
}
