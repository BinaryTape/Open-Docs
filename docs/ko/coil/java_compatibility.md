# 자바 호환성

코일의 API는 코틀린 우선(Kotlin-first)으로 설계되었습니다. 코일은 인라인 람다(inlined lambdas), 리시버 파라미터(receiver params), 기본 인자(default arguments), 확장 함수(extension functions)와 같이 자바에서 사용할 수 없는 코틀린 언어 기능을 활용합니다.

중요한 점은 `suspend` 함수는 자바에서 구현될 수 없다는 것입니다. 이는 사용자 지정 [Transformation](/coil/api/coil-core/coil3.transform/-transformation), [Size Resolver](/coil/api/coil-core/coil3.size/-size-resolver), [Fetcher](image_pipeline.md#fetchers), [Decoder](image_pipeline.md#decoders)는 코틀린으로 구현되어야 **합니다**.

이러한 제약에도 불구하고, 코일 API의 대부분은 자바와 호환됩니다. 다음을 사용하여 싱글톤 `ImageLoader`를 얻을 수 있습니다:

```java
ImageLoader imageLoader = SingletonImageLoader.get(context);
```

`ImageRequest`를 큐에 넣는(enqueue) 구문은 자바와 코틀린에서 거의 동일합니다:

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

`suspend` 함수는 자바에서 쉽게 호출할 수 없습니다. 따라서 이미지를 동기적으로 얻으려면 다음과 같이 자바에서 호출할 수 있는 `ImageLoader.executeBlocking` 확장 함수를 사용해야 합니다:

```java
ImageRequest request = new ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .size(1080, 1920)
    .build();
Drawable drawable = ImageLoaders.executeBlocking(imageLoader, request).getImage().asDrawable(context.resources);
```

!!! Note
    `ImageLoaders.executeBlocking`은 `suspend`하는 대신 현재 스레드를 차단합니다. 메인 스레드에서 이것을 호출하지 마십시오.