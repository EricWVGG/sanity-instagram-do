# Sanity-Instagram-DO

This is a Digital Ocean serverless function that will import an Instagram feed into Sanity.

I assume that you’re coming to this with pretty good familiarity with Sanity. You’ll also be dabbling in the Meta Developers portal, and of course Digital Ocean’s serverless functions platform.

Instructions for dealing with DO and Meta is outside the scope of this document, but I’ve provided links to resources I found helpful.

## Steps

### .env

This should look pretty familiar to any Sanity developer…

```
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_VERSION=
SANITY_SECRET_TOKEN=
```

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

### Access Token

So, why are we storing the access token in Sanity instead of an `.env` file? That token only lasts sixty days — you'll be coming back and manually updating and redeploying this function forever if we did that. So instead it gets stored in Sanity.

Go into your Sanity Studio, and edit your Site document. “Seed” it with that access token and publish the document.

### Digital Ocean

If you’re not already familiar with them already, here is a [guide to Digital Ocean serverless functions](https://docs.digitalocean.com/products/functions/how-to/create-functions/).

Customize the `project.yml` file. You can alter the RAM limit (all the functions I’ve written seem to choke on under 512mb). Timeout should be generous, connecting to all these third-parties takes time. And there’s a familiar CRON schedule at the bottom.

Before running locally, I suggest pulling up Sanity Studio in a web browser window, with the Instagram Post document type selected.

- go to `/packages/sanity-instagram-do/post` and run `npm run build`
- then run `node -e 'import("./lib/index.js").then( loadedModule => loadedModule.main() )'`

If it was successful, the 20 latest Instagram posts should appear in Sanity. Also, go the Site document; the access token should be replaced with a new token that will last 60 days. That token is refreshed every time this script is run, so as long as you've got it on a cron for at least once every 59 days, it should stay fresh forever.

## To deploy…

- from root: `doctl sls deploy . --verbose-build --env ./.env`

## Future

This function gets the latest 20 posts from Instagram, downloads _all_ their attached images, and then upserts on Sanity.

If we connected to Sanity first to get existing post IDs, we could skip all known posts from Instagram. That would make this run much faster (serverless functions charge by the second!).

I haven’t tested this with video posts at all.
