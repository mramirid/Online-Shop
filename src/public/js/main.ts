const backdrop = document.querySelector('.backdrop') as HTMLDivElement 
const sideDrawer = document.querySelector('.mobile-nav') as HTMLDivElement
const menuToggle = document.querySelector('#side-menu-toggle') as HTMLButtonElement

backdrop.addEventListener('click', () => {
  backdrop.style.display = 'none'
  sideDrawer.classList.remove('open')
})

menuToggle.addEventListener('click', () => {
  backdrop.style.display = 'block'
  sideDrawer.classList.add('open')
})