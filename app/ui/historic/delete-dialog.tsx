
type DeleteModalProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteModal({
    onConfirm,
    onCancel,
}: DeleteModalProps){

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                <h2 className="text-xl font-semibold text-gray-900">
                    Delete weather record?
                </h2>

                <p className="mt-3 text-gray-600">
                    This action cannot be undone. Are you sure you want to
                    delete this record?
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}