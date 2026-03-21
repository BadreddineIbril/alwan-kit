function extractLch(lch: string) {
  const [l, c, h] = lch.match(/[\d.]+/g) || [];
  return { l: +l, c: (+c), h: +h };
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export { extractLch, download };
