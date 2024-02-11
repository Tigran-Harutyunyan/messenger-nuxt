export default defineNuxtRouteMiddleware((to) => {
    const { status } = useAuth()
    // Return immediately if user is already authenticated
    if (status.value === 'authenticated') {
        return
    }


    return navigateTo({ path: '/' })
})