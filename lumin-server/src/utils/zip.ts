export async function hasZipMagic(file: File): Promise<boolean> {
    const buf = new Uint8Array(await file.slice(0, 4).arrayBuffer())
    const [P, K, a, b] = buf
    if (P !== 0x50 || K !== 0x4b) return false

    return (
        a === 0x03 && b === 0x04
    )
}