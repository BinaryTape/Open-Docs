# SVG

SVG 지원을 추가하려면 확장 라이브러리를 가져옵니다.

```kotlin
implementation("io.coil-kt.coil3:coil-svg:3.3.0")
```

이것으로 끝입니다! `ImageLoader`는 SVG를 자동으로 감지하고 디코딩합니다. Coil은 파일의 첫 1KB에서 `<svg ` 마커를 찾아 SVG를 감지하며, 이는 대부분의 경우를 처리할 수 있습니다. SVG가 자동으로 감지되지 않으면, 요청에 대해 `Decoder`를 명시적으로 설정할 수 있습니다.

```kotlin
imageView.load("/path/to/svg") {
    decoderFactory { result, options, _ -> SvgDecoder(result.source, options) }
}
```

선택적으로, `ImageLoader`를 구성할 때 컴포넌트 레지스트리에 디코더를 수동으로 추가할 수 있습니다.

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .components {
        add(SvgDecoder.Factory())
    }
    .build()