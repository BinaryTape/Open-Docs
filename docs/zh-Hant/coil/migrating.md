# 從 Glide/Picasso 遷移

以下是一些如何將 Glide/Picasso 呼叫遷移至 Coil 呼叫的範例：

### 基本用法

```kotlin
// Glide
Glide.with(context)
    .load(url)
    .into(imageView)

// Picasso
Picasso.get()
    .load(url)
    .into(imageView)

// Coil
imageView.load(url)
```

### 自訂請求

```kotlin
imageView.scaleType = ImageView.ScaleType.FIT_CENTER

// Glide
Glide.with(context)
    .load(url)
    .placeholder(placeholder)
    .fitCenter()
    .into(imageView)

// Picasso
Picasso.get()
    .load(url)
    .placeholder(placeholder)
    .fit()
    .into(imageView)

// Coil (automatically detects the scale type)
imageView.load(url) {
    placeholder(placeholder)
}
```

### 非檢視目標

```kotlin
// Glide (has optional callbacks for start and error)
Glide.with(context)
    .load(url)
    .into(object : CustomTarget<Drawable>() {
        override fun onResourceReady(resource: Drawable, transition: Transition<Drawable>) {
            // Handle the successful result.
        }

        override fun onLoadCleared(placeholder: Drawable) {
            // Remove the drawable provided in onResourceReady from any Views and ensure no references to it remain.
        }
    })

// Picasso
Picasso.get()
    .load(url)
    .into(object : BitmapTarget {
        override fun onBitmapLoaded(bitmap: Bitmap, from: Picasso.LoadedFrom) {
            // Handle the successful result.
        }

        override fun onBitmapFailed(e: Exception, errorDrawable: Drawable?) {
            // Handle the error drawable.
        }

        override fun onPrepareLoad(placeHolderDrawable: Drawable?) {
            // Handle the placeholder drawable.
        }
    })

// Coil
val request = ImageRequest.Builder(context)
    .data(url)
    .target(
        onStart = { placeholder ->
            // Handle the placeholder drawable.
        },
        onSuccess = { result ->
            // Handle the successful result.
        },
        onError = { error ->
            // Handle the error drawable.
        }
    )
    .build()
context.imageLoader.enqueue(request)
```

### 背景執行緒

```kotlin
// Glide (blocks the current thread; must not be called from the main thread)
val drawable = Glide.with(context)
    .load(url)
    .submit(width, height)
    .get()

// Picasso (blocks the current thread; must not be called from the main thread)
val drawable = Picasso.get()
    .load(url)
    .resize(width, height)
    .get()

// Coil (suspends, non-blocking, and thread safe)
val request = ImageRequest.Builder(context)
    .data(url)
    .size(width, height)
    .build()
val drawable = context.imageLoader.execute(request).drawable