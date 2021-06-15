// 此檔案之程式碼改編自 mVChr 大大在 Stack Overflow 上的某篇解答，十分感謝他！
// https://stackoverflow.com/a/5723274

export const truncateMiddle = (fullStr: string, strLen: number, separator?: string) => {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || '...';

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars);
};