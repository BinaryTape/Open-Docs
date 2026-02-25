# 자바 호환성 (Java Compatibility)

Coil의 API는 코틀린 우선(Kotlin-first)으로 설계되었습니다. 이는 자바에서는 사용할 수 없는 인라인 람다(inlined lambdas), 수신 객체 파라미터(receiver params), 기본 인자(default arguments), 확장 함수(extension functions)와 같은 코틀린 언어의 기능을 활용합니다.

중요한 점은, 중단 함수(suspend functions)는 자바에서 구현할 수 없다는 것입니다. 이는 커스텀 [Transformations](/coil/api/coil-core/coil3.transform/-transformation), [Size Resolvers](/coil/api/coil-core/coil3.size/-size-resolver), [Fetchers](image_pipeline.md#fetchers), [Decoders](image_pipeline.md#decoders)를 **반드시** 코틀린으로 구현해야 함을 의미합니다.

이러한 제한 사항에도 불구하고, Coil API의 대부분은 자바와 호환됩니다. 다음과 같이 싱글톤 `ImageLoader`를 가져올 수 있습니다:

```java
ImageLoader imageLoader = SingletonImageLoader.get(context);
```

`ImageRequest`를 큐에 추가하는(enqueue) 구문은 자바와 코틀린에서 거의 동일합니다:

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .crossfade(true)
    .target(new ImageViewTarget(imageView))
    .build();
imageLoader.enqueue(request);
```

!!! Note
    `ImageView.load`는 자바에서 사용할 수 없습니다. 대신 `ImageRequest.Builder` API를 사용하세요.

`suspend` 함수는 자바에서 쉽게 호출할 수 없습니다. 따라서 이미지를 동기적으로 가져오려면 다음과 같이 자바에서 호출할 수 있는 `ImageLoader.executeBlocking` 확장 함수를 사용해야 합니다:

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .size(1080, 1920)
    .build();
Image image = ImageLoaders.executeBlocking(imageLoader, request).getImage();
Drawable drawable = Image_androidKt.asDrawable(image, context.resources);
```

!!! Note
    `ImageLoaders.executeBlocking`은 중단(suspending)하는 대신 현재 스레드를 차단(block)합니다. 메인 스레드에서 이를 호출하지 마세요.