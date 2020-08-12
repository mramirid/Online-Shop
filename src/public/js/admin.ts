async function deleteProduct(button: HTMLButtonElement) {
  const productElement = button.closest('article') as HTMLDivElement
  const inputProductId = button.parentNode!.querySelector('[name=productId]') as HTMLInputElement
  const inputCSRF = button.parentNode!.querySelector('[name=_csrf]') as HTMLInputElement

  const productId = inputProductId.value
  const csrfToken = inputCSRF.value

  try {
    const response = await fetch(`/admin/product/${productId}`, {
      method: 'DELETE',
      headers: { 'csrf-token': csrfToken }
    })

    if (response.status !== 200) throw 'Deletion failed'

    const responseBody = await response.json()
    console.log(responseBody.message)
    productElement.remove()

  } catch (error) {
    console.log(error)
  }
}