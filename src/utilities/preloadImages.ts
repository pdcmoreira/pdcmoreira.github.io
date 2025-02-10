export const preloadImages = async (urls: string[]): Promise<void> => {
  if (!urls.length) {
    return
  }

  const loaders = urls.map(
    (url) =>
      new Promise((resolve, reject) => {
        const image = new Image()

        image.onload = resolve

        image.onerror = reject

        image.src = url
      })
  )

  await Promise.allSettled(loaders)
}
