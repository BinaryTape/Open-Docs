# Glide/Picassoからの移行

Glide/Picassoの呼び出しをCoilの呼び出しに移行する方法のいくつかの例を以下に示します。

### 基本的な使い方

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

### カスタムリクエスト

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

// Coil (スケールタイプを自動検出します)
imageView.load(url) {
    placeholder(placeholder)
}
```

### View以外のターゲット

```kotlin
// Glide (開始時とエラー時にオプションのコールバックがあります)
Glide.with(context)
    .load(url)
    .into(object : CustomTarget<Drawable>() {
        override fun onResourceReady(resource: Drawable, transition: Transition<Drawable>) {
            // 成功した結果を処理します。
        }

        override fun onLoadCleared(placeholder: Drawable) {
            // onResourceReadyで提供されたドロウアブルをビューから削除し、それへの参照が残らないようにします。
        }
    })

// Picasso
Picasso.get()
    .load(url)
    .into(object : BitmapTarget {
        override fun onBitmapLoaded(bitmap: Bitmap, from: Picasso.LoadedFrom) {
            // 成功した結果を処理します。
        }

        override fun onBitmapFailed(e: Exception, errorDrawable: Drawable?) {
            // エラードロウアブルを処理します。
        }

        override fun onPrepareLoad(placeHolderDrawable: Drawable?) {
            // プレースホルダードロウアブルを処理します。
        }
    })

// Coil
val request = ImageRequest.Builder(context)
    .data(url)
    .target(
        onStart = { placeholder ->
            // プレースホルダードロウアブルを処理します。
        },
        onSuccess = { result ->
            // 成功した結果を処理します。
        },
        onError = { error ->
            // エラードロウアブルを処理します。
        }
    )
    .build()
context.imageLoader.enqueue(request)
```

### バックグラウンドスレッド

```kotlin
// Glide (現在のスレッドをブロックします。メインスレッドから呼び出してはいけません)
val drawable = Glide.with(context)
    .load(url)
    .submit(width, height)
    .get()

// Picasso (現在のスレッドをブロックします。メインスレッドから呼び出してはいけません)
val drawable = Picasso.get()
    .load(url)
    .resize(width, height)
    .get()

// Coil (中断可能で、ノンブロッキング、スレッドセーフです)
val request = ImageRequest.Builder(context)
    .data(url)
    .size(width, height)
    .build()
val drawable = context.imageLoader.execute(request).drawable