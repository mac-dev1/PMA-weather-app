import clsx from "clsx";

type UnitButtonProps = {
    label: string;
    value: "metric" | "imperial" | "standard";
    selected: boolean;
    onClick: (value: "metric" | "imperial" | "standard") => void;
};

export default function UnitButton({
    label,
    value,
    selected,
    onClick,
}: UnitButtonProps) {
    return (
        <button
            onClick={() => onClick(value)}
            className={clsx(
                "rounded-md px-2 ml-2 transition-colors",
                selected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
        >
            {label}
        </button>
    );
}