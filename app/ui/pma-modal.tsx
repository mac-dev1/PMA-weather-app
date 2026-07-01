
type PMAModalProps = {
    onClose: () => void;
};

export function PMAModal({onClose}:PMAModalProps){

     return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                {/* Header */}
                <div className="rounded-t-2xl bg-gradient-to-r from-blue-700 to-cyan-600 px-8 py-6 text-white">
                    <h2 className="text-3xl font-bold">
                        🚀 Product Manager Accelerator
                    </h2>

                    <p className="mt-2 text-blue-100">
                        Helping Product Managers accelerate their careers through
                        mentorship, practical experience and leadership training.
                    </p>
                </div>

                {/* Body */}
                <div className="space-y-8 p-8">

                    <section>
                        <h3 className="mb-3 text-xl font-semibold">
                            Overview
                        </h3>

                        <p className="leading-7 text-gray-700">
                            The <strong>Product Manager Accelerator (PMA)</strong> program
                            supports Product Management professionals at every stage
                            of their careers—from students seeking their first PM role
                            to Directors preparing for executive leadership positions.
                        </p>

                        <p className="mt-4 leading-7 text-gray-700">
                            Hundreds of professionals have developed stronger product,
                            leadership and communication skills through PMA&apos;s community,
                            mentoring and hands-on learning programs.
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-4 text-xl font-semibold">
                            Programs & Services
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">

                            <div className="rounded-xl border p-4 shadow-sm">
                                <h4 className="font-semibold text-blue-700">
                                    🚀 PMA Pro
                                </h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    Complete Product Manager job preparation,
                                    FAANG-level interview practice, unlimited
                                    mock interviews and alumni referrals.
                                </p>
                            </div>

                            <div className="rounded-xl border p-4 shadow-sm">
                                <h4 className="font-semibold text-blue-700">
                                    🤖 AI PM Bootcamp
                                </h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    Build a real AI product alongside AI engineers,
                                    designers and data scientists while learning
                                    practical AI Product Management.
                                </p>
                            </div>

                            <div className="rounded-xl border p-4 shadow-sm">
                                <h4 className="font-semibold text-blue-700">
                                    💡 PMA Power Skills
                                </h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    Improve product thinking, leadership,
                                    communication and executive presentation
                                    abilities.
                                </p>
                            </div>

                            <div className="rounded-xl border p-4 shadow-sm">
                                <h4 className="font-semibold text-blue-700">
                                    👔 PMA Leader
                                </h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    Designed for experienced PMs pursuing Director
                                    and executive leadership positions.
                                </p>
                            </div>

                            <div className="rounded-xl border p-4 shadow-sm">
                                <h4 className="font-semibold text-blue-700">
                                    📄 Resume Review
                                </h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    Personalized Product Manager resume reviews
                                    with proven templates used by thousands of PMs.
                                </p>
                            </div>

                            <div className="rounded-xl border p-4 shadow-sm">
                                <h4 className="font-semibold text-blue-700">
                                    🎓 Free Learning Resources
                                </h4>
                                <p className="mt-2 text-sm text-gray-600">
                                    Access more than 500 free videos, courses and
                                    educational resources for aspiring Product
                                    Managers.
                                </p>
                            </div>

                        </div>
                    </section>

                    <section>
                        <h3 className="mb-3 text-xl font-semibold">
                            Learn More
                        </h3>

                        <div className="flex flex-col gap-2">

                            <a
                                href="https://www.pmaccelerator.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 transition hover:underline"
                            >
                                🌐 Official Website
                            </a>

                            <a
                                href="https://www.linkedin.com/company/product-manager-accelerator/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 transition hover:underline"
                            >
                                💼 LinkedIn
                            </a>

                            <a
                                href="https://www.youtube.com/c/drnancyli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 transition hover:underline"
                            >
                                ▶️ Free YouTube Courses
                            </a>

                            <a
                                href="https://www.drnancyli.com/pmresume"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 transition hover:underline"
                            >
                                📄 Free PM Resume Template
                            </a>

                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="flex justify-end border-t bg-gray-50 px-8 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}