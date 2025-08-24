# Sanity-Instagram-DO

This is a Digital Ocean serverless function that will import an Instagram feed into Sanity.

I assume that you’re coming to this with pretty good familiarity with Sanity. You’ll also be dabbling in the Meta Developers portal, and of course Digital Ocean’s serverless functions platform.

Instructions for dealing with DO and Meta are outside the scope of this document, but I’ve provided links to resources I found helpful.

It should be pretty easy to adapt this code to other platforms like AWS lambda. It would also work really well as a NextJS API function, provided that your host supports CRON tasks (Vercel does; DO and Render do not).

## Steps

### .env

This should look pretty familiar to any Sanity developer…

```
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_VERSION=
SANITY_SECRET_TOKEN=
```

The secret token does require `WRITE` privileges.

### Sanity

You’ll need two document additions to your Sanity schema — an Instagram posts document, and a singleton document that can store the Instagram `access_token` (more on why that needs to be stored in Sanity later).

I recommend that you just copy the `/sanity/instagramPostSchema.ts` file and add it to your own Sanity schema. Feel free to add new fields or customize the display of it to suit your needs, but don’t rename the document type or any of the fields unless you’re willing to update all the queries here that use it.

For storing the `access_token`: all of my Sanity projects have a document type called `site` that stores basic information about the site — its title, the default OpenGraph information, etc. There is always only one document of this type in my projects; any Groq query that looks it up looks for `*[_type == 'site'][0]` (that is, the first document of this type). So that document is already pefect for our purposes.

If you already have a similar system, add a `string` field called `instagramAccessToken`, and update the query in `index.ts` to find it. For example, if your master site document is called `website`…

```typescript
const siteQuery = defineQuery(`
  *[_type == 'website'][0]{ // < change 'site' to 'website'
    _id,
    instagramAccessToken
  }
`)
```

If you don’t have a similar system, copy the `/sanity/siteSchema.ts` file and add it to your own Sanity schema. I think down the road you’ll find a lot of uses for it.

Start out by creating a single document. Give it the name of your site and publish it.

### Instagram

Now for the difficult part.

You're going to need to create an Instagram app, and retrieve a ”long-lived access token”. I followed [these directions by Ming Shen Choo](https://cming0721.medium.com/instagram-feeds-with-instagram-api-part-1-create-app-and-token-4a91ee3bd154). You only need to follow the steps on part one of this two-part article, but don’t worry, there’s _a lot_ of them.

When you connect the Instagram account, I suggest that you turn off _all_ permissions except for viewing the feed. Giving the token permissions to private messages is totally unnecessary and even pretty risky.

### Access Token

So, why are we storing the access token in Sanity instead of an `.env` file? That token only lasts sixty days — you'll be coming back and manually updating and redeploying this function forever if we did that. So instead it gets stored in Sanity.

Go into your Sanity Studio, and edit your Site document. “Seed” it with that access token and publish the document.

_note:_ Going forward, it would be a really good idea to _not_ query the `instagramAccessToken` field with Groq. Don’t use `...` shorthand to pull all fields from `site`, either.

### Digital Ocean

If you’re not already familiar with them already, here is a [guide to Digital Ocean serverless functions](https://docs.digitalocean.com/products/functions/how-to/create-functions/).

Customize the `project.yml` file. You can alter the RAM limit (all the functions I’ve written seem to choke on under 512mb). Timeout should be generous, connecting to all these third-parties takes time. And there’s a familiar CRON schedule at the bottom.

To deploy, run `./deploy.sh` — which is just a shortcut for…

```
doctl sls deploy . --verbose-build --env ./.env
```

To test locally, I suggest pulling up Sanity Studio in a web browser window, with the Instagram Post document type selected. This is gonna be fun.

```
doctl sls functions invoke sanity-instagram-do/post
```

If it was successful, the 20 latest Instagram posts should automagically appear in Sanity (I love seeing that).

Also, go the Site document; the access token should be replaced with a new one. That token should _not_ match the one you filled in; it is refreshed every time this script is run, so as long as you've got it on a cron for at least once every 59 days, it should stay fresh forever.

## Future

This function gets the latest 20 posts from Instagram, downloads _all_ their attached images, and then upserts on Sanity.

If we connected to Sanity first to get existing post IDs, we could skip all known posts from Instagram. That would make this run much faster (serverless functions charge by the second!).

I haven’t tested this with video posts at all.

I might bake another version of this that uses NextJS API functions if there’s any interest. Unfortunately, my hosts don’t support CRON tasks, but it would work great with Vercel.

## Thanks

Big props to Ming Sheng Choo, without whom I never could have navigated the Meta Developers portal.
