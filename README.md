# Explanation of Internal error 500 with @tus/server in Nuxt 3

## General issue

`@tus/server` in Nitro server witing a Nuxt 3 app, deployed to Cloudflare pages, returns error when endpoint requested:
```
[nuxt] [request error] [unhandled] [500],Class extends value #<Object> is not a constructor or null in logs
in production logs
```

![image](https://github.com/user-attachments/assets/efb8aadd-b05c-4e4d-a97d-f8aae6deb744)

Production logs are not informative
![image](https://github.com/user-attachments/assets/02ce53cd-90bb-4e57-8091-316658d52887)

### Guessing

Probably it just happens because Cloudflare workers don't allow to store files as in classic file system. But the error is not informative and doesn't seem as related to a filesystem issue at all.

## Additional issue

The client page is not loaded and returns the error
```
TypeError: Cannot read properties of undefined (reading 'call')
```

### Solution

The reason is `tus-js-client` has to be used only for CSR. If you have
```ts
import * as tus from 'tus-js-client`
```
within a component (even with composable), it has to be only a client component. Add a suffix `.client` to the component name to load it only for CSR.

