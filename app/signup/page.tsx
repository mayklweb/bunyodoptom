"use client";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";
// import { useSignup } from "../shared/lib/useAuth";
import { LeftArrowIcon } from "../shared/icons";
import { useSignup } from "../hooks/auth/useSignup";

interface SignupFormValues {
  name: string;
  phone: string;
  password: string;
}

function SignupForm() {
  const router = useRouter();
  const { mutate: signup, isPending, isError, error } = useSignup();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const onSubmit = (data: SignupFormValues) => {
    signup({ ...data, verificationToken: "" }, {
      onSuccess: () => {
        router.replace("/profile");
      },
    });
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200
    focus:ring-2 focus:ring-primary/30 focus:border-primary
    ${
      hasError
        ? "border-red-400 bg-red-50"
        : "border-gray-200 bg-gray-50 hover:border-gray-300"
    }`;

  return (
    <div className="h-full relative flex items-center justify-center px-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-base font-semibold text-gray-900 mb-6 absolute top-10 left-2"
      >
        <LeftArrowIcon />
        <span>Orqaga</span>
      </button>
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Ro'yxatdan o'tish
          </h1>
          <p className="text-sm text-gray-500">Yangi hisob yarating</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl p-8 flex flex-col gap-5"
        >
          {isError && (
            <div className="flex items-center gap-2 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              <span>⚠️</span>
              <span>
                {(error as any)?.status === 409
                  ? "Bu telefon raqam allaqachon ro'yxatdan o'tgan. "
                  : ((error as any)?.message ?? "Ro'yxatdan o'tishda xatolik")}
              </span>
              {(error as any)?.status === 409 && (
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="ml-2 underline font-semibold"
                >
                  Kirish
                </button>
              )}
            </div>
          )}
          {/* Name */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700">
              Ism
            </label>
            <input
              placeholder="Ismingizni kiriting"
              className={inputClass(!!errors.name)}
              {...register("name", {
                required: "Ism kiritilishi shart",
                minLength: { value: 2, message: "Kamida 2 ta belgi" },
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700">
              Telefon raqam
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Telefon raqam kiritilishi shart",
                minLength: { value: 9, message: "Noto'g'ri telefon raqam" },
              }}
              render={({ field: { onChange, value } }) => (
                <PatternFormat
                  format="+998 ## ### ## ##"
                  mask=" "
                  placeholder="+998 90 123 45 67"
                  value={value}
                  onValueChange={(values) => onChange(values.value)}
                  className={inputClass(!!errors.phone)}
                />
              )}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700">
              Parol
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass(!!errors.password)}
              {...register("password", {
                required: "Parol kiritilishi shart",
                minLength: { value: 6, message: "Kamida 6 ta belgi" },
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold text-sm py-3.5 rounded-xl
              transition-all duration-200 active:scale-[0.98] mt-2"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Yuklanmoqda...
              </span>
            ) : (
              "Ro'yxatdan o'tish"
            )}
          </button>

          {/* ✅ Login route */}
          <p className="text-center text-sm text-gray-500">
            Hisobingiz bormi?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-primary font-semibold hover:underline"
            >
              Kirish
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
