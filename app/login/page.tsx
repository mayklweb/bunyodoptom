"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { LeftArrowIcon } from "../shared/icons";
import { useLogin } from "../hooks/auth/useLogin";

interface LoginFormValues {
  phone: string;
  password: string;
}

/* ------------------------------------------------------------------ */
/* Field primitives — same anatomy and styling as shadcn's Field:      */
/* FieldSet > FieldLegend + FieldDescription + FieldGroup > Field ...  */
/* ------------------------------------------------------------------ */

function FieldSet({ children }: { children: React.ReactNode }) {
  return <fieldset className="flex flex-col gap-6">{children}</fieldset>;
}

function FieldLegend({ children }: { children: React.ReactNode }) {
  return (
    <legend className="mb-1 text-base font-medium text-gray-900">
      {children}
    </legend>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full flex-col gap-6">{children}</div>;
}

function Field({
  invalid,
  children,
}: {
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      role="group"
      data-invalid={invalid || undefined}
      className="group/field flex w-full flex-col gap-2"
    >
      {children}
    </div>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex w-fit items-center gap-2 text-sm font-medium leading-snug text-gray-900 group-data-[invalid]/field:text-red-600"
    >
      {children}
    </label>
  );
}

function FieldDescription({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      className={`text-sm font-normal leading-normal text-balance text-gray-500 ${className}`}
    >
      {children}
    </p>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm font-normal text-red-600">
      {message}
    </p>
  );
}

function FieldSeparator({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative -my-2 flex h-5 items-center text-sm" aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
      {children && (
        <span className="relative mx-auto bg-white px-2 text-gray-500">
          {children}
        </span>
      )}
    </div>
  );
}

const inputClass =
  "h-9 w-full min-w-0 rounded-md border border-gray-200 bg-transparent px-3 py-1 text-base text-gray-900 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-gray-400 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/20 md:text-sm";

/* ------------------------------------------------------------------ */

function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { phone: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: () => router.replace("/profile"),
    });
  };

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-4 py-16">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute left-4 top-6 inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 sm:left-8 sm:top-8"
      >
        <LeftArrowIcon />
        Orqaga
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm"
      >
        <FieldSet>
          <div>
            <FieldLegend>Kirish</FieldLegend>
            <FieldDescription>
              Hisobingizga kirish uchun ma&apos;lumotlarni kiriting
            </FieldDescription>
          </div>

          <FieldGroup>
            {/* Phone */}
            <Field invalid={!!errors.phone}>
              <FieldLabel htmlFor="login-phone">Telefon raqam</FieldLabel>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Telefon raqam kiritilishi shart",
                  pattern: {
                    value: /^\d{9}$/,
                    message: "Noto'g'ri telefon raqam",
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref, name } }) => (
                  <PatternFormat
                    id="login-phone"
                    name={name}
                    getInputRef={ref}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    format="+998 ## ### ## ##"
                    mask=" "
                    placeholder="+998 90 123 45 67"
                    value={value}
                    onBlur={onBlur}
                    onValueChange={(values) => onChange(values.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={
                      errors.phone ? "login-phone-error" : "login-phone-desc"
                    }
                    className={inputClass}
                  />
                )}
              />
              {errors.phone ? (
                <FieldError
                  id="login-phone-error"
                  message={errors.phone.message}
                />
              ) : (
                <FieldDescription id="login-phone-desc">
                  Ro&apos;yxatdan o&apos;tishda ko&apos;rsatgan raqamingiz.
                </FieldDescription>
              )}
            </Field>

            {/* Password */}
            <Field invalid={!!errors.password}>
              <FieldLabel htmlFor="login-password">Parol</FieldLabel>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Parolni kiriting"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password
                      ? "login-password-error"
                      : "login-password-desc"
                  }
                  className={`${inputClass} pr-10`}
                  {...register("password", {
                    required: "Parol kiritilishi shart",
                    minLength: { value: 6, message: "Kamida 6 ta belgi" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-md text-gray-400 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <FieldError
                  id="login-password-error"
                  message={errors.password.message}
                />
              ) : (
                <FieldDescription id="login-password-desc">
                  Kamida 6 ta belgi.
                </FieldDescription>
              )}
            </Field>

            {/* Server error + submit */}
            <Field>
              {isError && (
                <FieldError
                  message={error?.message ?? "Kirishda xatolik yuz berdi"}
                />
              )}
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50"
              >
                {isPending && (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                )}
                {isPending ? "Kirilmoqda..." : "Kirish"}
              </button>
            </Field>

            <FieldSeparator>yoki</FieldSeparator>

            {/* Signup */}
            <Field>
              <Link
                href="/signup"
                className="inline-flex h-9 w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 shadow-xs transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
              <FieldDescription className="text-center">
                Hisobingiz yo&apos;qmi? Yangi hisob yarating.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}

export default LoginForm;