import NextAuth from 'next-auth'
// import AppleProvider from 'next-auth/providers/apple'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from 'next-auth/providers/github'
import User from '@/models/User'
import connectDb from '@/db/connectDb'

export const authoptions = NextAuth({
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET
    // }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      authorization: { params: { scope: 'public_profile,email' } }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>'
    // }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider == 'github' || account.provider == "google" || account.provider == "facebook") {
        await connectDb()

        //check if the user already exists in the database
        const currentUser = await User.findOne({ email: user.email })
        if (!currentUser) {
          //create new user
          const newUser = await User.create({
            email: user.email,
            username: user.email.split("@")[0],
            profilePic: user.image, // Save profile picture from OAuth provider
            socialMedia: {
              facebook: "https://www.facebook.com",
              twitter: "https://www.twitter.com",
              linkedin: "https://www.linkedin.com",
              instagram: "https://www.instagram.com",
              github: "https://www.github.com",
              youtube: "https://www.youtube.com"
            }
          })
          console.log("New user created:", newUser)
        }
        return true
      }
      else if(account.provider == 'facebook'){
        await connectDb()
        const currentUser = await User.findOne({ email: user.email })
        if (!currentUser) {
          //create new user
          const newUser = await User.create({
            email: user.email,
            username: user.email.split("@")[0],
            profilePic: user.image, // Save profile picture from OAuth provider
            socialMedia: {
              facebook: "https://www.facebook.com",
              twitter: "https://www.twitter.com",
              linkedin: "https://www.linkedin.com",
              instagram: "https://www.instagram.com",
              github: "https://www.github.com",
              youtube: "https://www.youtube.com"
            }
          })
          console.log("New user created:", newUser)
        }
        return true
      }
    },
    async session({ session }) {
      // Send properties to the client, like an access_token and user id from a provider.
      const dbUser = await User.findOne({ email: session.user.email })
      session.user.name = dbUser.username
      return session
    }
  }
})

export { authoptions as GET, authoptions as POST }