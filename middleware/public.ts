export default defineNuxtRouteMiddleware((to) => {
    const { status } = useAuth()

    if (status.value === 'authenticated') {
        return navigateTo({ path: '/conversations' })
    }
})