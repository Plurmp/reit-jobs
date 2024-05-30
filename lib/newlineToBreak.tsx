export function newlineToBreak(str?: string) {
    return str?.split('\n').map(substr => {
        return (
            <>
                {substr}
                < br />
            </>
        );
    });
}