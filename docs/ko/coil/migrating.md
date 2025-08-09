# Glide/Picasso에서 전환하기

다음은 Glide/Picasso 호출을 Coil 호출로 전환하는 몇 가지 예시입니다.

### 기본 사용법

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

### 커스텀 요청

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

// Coil (스케일 타입을 자동으로 감지합니다)
imageView.load(url) {
    placeholder(placeholder)
}
```

### 뷰가 아닌 타겟

```kotlin
// Glide (시작 및 오류에 대한 선택적 콜백을 가집니다)
Glide.with(context)
    .load(url)
    .into(object : CustomTarget<Drawable>() {
        override fun onResourceReady(resource: Drawable, transition: Transition<Drawable>) {
            // 성공적인 결과를 처리합니다.
        }

        override fun onLoadCleared(placeholder: Drawable) {
            // onResourceReady에서 제공된 드로어블을 모든 View에서 제거하고 참조가 남아있지 않도록 합니다.
        }
    })

// Picasso
Picasso.get()
    .load(url)
    .into(object : BitmapTarget {
        override fun onBitmapLoaded(bitmap: Bitmap, from: Picasso.LoadedFrom) {
            // 성공적인 결과를 처리합니다.
        }

        override fun onBitmapFailed(e: Exception, errorDrawable: Drawable?) {
            // 오류 드로어블을 처리합니다.
        }

        override fun onPrepareLoad(placeHolderDrawable: Drawable?) {
            // 플레이스홀더 드로어블을 처리합니다.
        }
    })

// Coil
val request = ImageRequest.Builder(context)
    .data(url)
    .target(
        onStart = { placeholder ->
            // 플레이스홀더 드로어블을 처리합니다.
        },
        onSuccess = { result ->
            // 성공적인 결과를 처리합니다.
        },
        onError = { error ->
            // 오류 드로어블을 처리합니다.
        }
    )
    .build()
context.imageLoader.enqueue(request)
```

### 백그라운드 스레드

```kotlin
// Glide (현재 스레드를 차단합니다; 메인 스레드에서 호출하면 안 됩니다)
val drawable = Glide.with(context)
    .load(url)
    .submit(width, height)
    .get()

// Picasso (현재 스레드를 차단합니다; 메인 스레드에서 호출하면 안 됩니다)
val drawable = Picasso.get()
    .load(url)
    .resize(width, height)
    .get()

// Coil (정지(suspends)되며, 논블로킹(non-blocking)이고, 스레드 안전(thread safe)합니다)
val request = ImageRequest.Builder(context)
    .data(url)
    .size(width, height)
    .build()
val drawable = context.imageLoader.execute(request).drawable