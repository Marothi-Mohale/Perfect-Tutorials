import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="hero-bg relative py-20">
      <div className="page-shell relative z-10 flex justify-center">
        <div className="surface-card w-full max-w-md rounded-[1.8rem] p-8">
          <SignUp />
        </div>
      </div>
    </section>
  );
}
