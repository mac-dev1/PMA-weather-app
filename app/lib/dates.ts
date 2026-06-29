

export function findMissingDates(
    existingDates: Array<string>,
    start: number,
    end: number
):string[]{
    const existing = new Set(existingDates)

    const missing: string[] = [];

    const current = new Date(start)
    const last = new Date(end)

    while (current <= last) {
        const date = current.toUTCString();

        if (!existing.has(date)) {
            missing.push(date);
        }

        current.setUTCDate(current.getUTCDate() + 1);
    }
    
    return missing;
}