# 자주 묻는 질문

FAQ에 없는 질문이 있으신가요? [StackOverflow](https://stackoverflow.com/questions/tagged/coil)에서 `#coil` 태그로 확인하거나 [Github discussions](https://github.com/coil-kt/coil/discussions)를 검색해 보세요.

## Coil은 자바 프로젝트 또는 코틀린/자바 혼합 프로젝트에서 사용할 수 있나요?

네! [여기서 확인하세요](java_compatibility.md).

## 이미지를 미리 로드하려면 어떻게 해야 하나요?

타겟 없이 이미지 요청을 시작하세요:

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .build()
imageLoader.enqueue(request)
```

이렇게 하면 이미지가 미리 로드되어 디스크 및 메모리 캐시에 저장됩니다.

디스크 캐시에만 미리 로드하려면 디코딩 및 메모리 캐시 저장을 건너뛸 수 있습니다:

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    // 메모리 캐시 쓰기를 비활성화합니다.
    .memoryCachePolicy(CachePolicy.DISABLED)
    // 디코딩 단계를 건너뛰어 이미지를 메모리로 디코딩하는 데 시간/메모리를 낭비하지 않습니다.
    .decoderFactory(BlackholeDecoder.Factory())
    .build()
imageLoader.enqueue(request)
```

## 로깅을 활성화하려면 어떻게 해야 하나요?

[`ImageLoader`를 구성할 때](getting_started.md#configuring-the-singleton-imageloader) `logger(DebugLogger())`를 설정하세요.

!!! 참고
    `DebugLogger`는 디버그 빌드에서만 사용해야 합니다.

## 자바 8 또는 자바 11을 타겟팅하려면 어떻게 해야 하나요?

Coil은 [자바 8 바이트코드](https://developer.android.com/studio/write/java8-support)를 필요로 합니다. 이것은 Android Gradle Plugin `4.2.0` 이상 버전과 Kotlin Gradle Plugin `1.5.0` 이상 버전에서 기본적으로 활성화됩니다. 이전 버전의 플러그인을 사용하는 경우 Gradle 빌드 스크립트에 다음을 추가하세요:

```kotlin
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
}
```

Coil `3.2.0`부터는 `coil-compose` 및 `coil-compose-core`에 자바 11 바이트코드가 필요합니다:

```kotlin
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
}
```

## 개발 스냅샷은 어떻게 얻나요?

저장소 목록에 스냅샷 저장소를 추가하세요:

Gradle (`.gradle`):

```groovy
allprojects {
    repositories {
        maven { url 'https://oss.sonatype.org/content/repositories/snapshots' }
    }
}
```

Gradle Kotlin DSL (`.gradle.kts`):

```kotlin
allprojects {
    repositories {
        maven("https://oss.sonatype.org/content/repositories/snapshots")
    }
}
```

그 다음 [최신 스냅샷 버전](https://github.com/coil-kt/coil/blob/main/gradle.properties#L34)으로 동일한 아티팩트에 의존하세요.

!!! 참고
    스냅샷은 CI를 통과하는 `main` 브랜치의 각 새 커밋에 대해 배포됩니다. 이는 잠재적으로 호환성을 깨는 변경 사항을 포함하거나 불안정할 수 있습니다. 사용 시 주의하시기 바랍니다.

## Coil과 함께 Proguard를 어떻게 사용하나요?

Coil과 함께 Proguard를 사용하려면 설정에 다음 규칙을 추가하세요:

```
-keep class coil3.util.DecoderServiceLoaderTarget { *; }
-keep class coil3.util.FetcherServiceLoaderTarget { *; }
-keep class coil3.util.ServiceLoaderComponentRegistry { *; }
-keep class * implements coil3.util.DecoderServiceLoaderTarget { *; }
-keep class * implements coil3.util.FetcherServiceLoaderTarget { *; }
```

Ktor, OkHttp, Coroutines에 대한 사용자 지정 규칙을 추가해야 할 수도 있습니다.

!!! 참고
    **R8을 사용하는 경우 Coil에 대한 사용자 지정 규칙을 추가할 필요가 없습니다**. R8은 Android의 기본 코드 축소기입니다. 규칙은 자동으로 추가됩니다.