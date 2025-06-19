export default function Error() {
    return (
        <div className={"error-container"}>
            <div className={"error-card"}>
                {/* Cross icon */}
                <svg
                    className={"error-icon"}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <h1 className={"error-title"}>App Error</h1>
                <p className={"error-message"}>
                    Something went wrong. Error details have been logged to the renderer console.
                </p>
            </div>
        </div>
    );
}
