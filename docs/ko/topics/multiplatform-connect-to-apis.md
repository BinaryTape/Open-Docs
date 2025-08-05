[//]: # (title: 플랫폼별 API 사용하기)

이 문서에서는 멀티플랫폼 애플리케이션과 라이브러리를 개발할 때 플랫폼별 API를 사용하는 방법을 알아봅니다.

## Kotlin 멀티플랫폼 라이브러리

플랫폼별 API를 사용하는 코드를 작성하기 전에, 대신 멀티플랫폼 라이브러리를 사용할 수 있는지 확인하세요.
이러한 유형의 라이브러리는 다양한 플랫폼에 대해 다른 구현을 갖는 공통 Kotlin API를 제공합니다.

네트워킹, 로깅, 분석 기능을 구현하고 디바이스 기능에 접근하는 등 이미 많은 라이브러리가 존재하며 사용할 수 있습니다.
자세한 내용은 [이 엄선된 목록](https://github.com/terrakok/kmm-awesome)을 참조하세요.

## `expect`/`actual` 함수 및 프로퍼티

Kotlin은 공통 로직을 개발하면서 플랫폼별 API에 접근할 수 있는 언어 메커니즘을 제공합니다:
[`expect`/`actual` 선언](multiplatform-expect-actual.md).

이 메커니즘을 사용하면 멀티플랫폼 모듈의 공통 소스 세트가 `expect` 선언을 정의하고, 모든 플랫폼 소스 세트는 해당 `expect` 선언에 상응하는 `actual` 선언을 제공해야 합니다. 컴파일러는 공통 소스 세트에서 `expect` 키워드로 표시된 모든 선언이 대상 플랫폼 소스 세트 모두에 `actual` 키워드로 표시된 상응하는 선언을 가지고 있는지 확인합니다.

이는 함수, 클래스, 인터페이스, 열거형, 프로퍼티, 어노테이션과 같은 대부분의 Kotlin 선언에 적용됩니다. 이 섹션에서는 `expect`/`actual` 함수와 프로퍼티를 사용하는 데 중점을 둡니다.

![expect/actual 함수 및 프로퍼티 사용](expect-functions-properties.svg){width=700}

이 예시에서는 공통 소스 세트에서 `expect` `platform()` 함수를 정의하고 플랫폼 소스 세트에서 실제 구현을 제공합니다. 특정 플랫폼을 위한 코드를 생성할 때 Kotlin 컴파일러는 `expect` 및 `actual` 선언을 병합합니다. 이를 통해 하나의 `platform()` 함수를 실제 구현과 함께 생성합니다. `expect` 및 `actual` 선언은 동일한 패키지에 정의되어야 하며, 결과 플랫폼 코드에서는 _하나의 선언_으로 병합됩니다. 생성된 플랫폼 코드에서 `expect` `platform()` 함수를 호출하면 올바른 `actual` 구현이 호출됩니다.

### 예시: UUID 생성하기

Kotlin Multiplatform를 사용하여 iOS 및 Android 애플리케이션을 개발하고 범용 고유 식별자(UUID)를 생성하고 싶다고 가정해 봅시다.

이를 위해 Kotlin Multiplatform 모듈의 공통 소스 세트에서 `expect` 키워드를 사용하여 `randomUUID()` 함수를 선언합니다. 구현 코드는 **포함하지 마세요**.

```kotlin
// In the common source set:
expect fun randomUUID(): String
```

각 플랫폼별 소스 세트(iOS 및 Android)에서 공통 모듈에서 `expect`된 `randomUUID()` 함수에 대한 실제 구현을 제공하세요. 이 실제 구현을 표시하려면 `actual` 키워드를 사용하세요.

![expect/actual 선언으로 UUID 생성](expect-generate-uuid.svg){width=700}

다음 스니펫은 Android 및 iOS에 대한 구현을 보여줍니다. 플랫폼별 코드는 `actual` 키워드와 함수에 동일한 이름을 사용합니다.

```kotlin
// In the android source set:
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// In the iOS source set:
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()
```

Android 구현은 Android에서 사용할 수 있는 API를 사용하고, iOS 구현은 iOS에서 사용할 수 있는 API를 사용합니다. Kotlin/Native 코드에서 iOS API에 접근할 수 있습니다.

Android를 위한 결과 플랫폼 코드를 생성하는 동안 Kotlin 컴파일러는 `expect` 및 `actual` 선언을 자동으로 병합하고, 실제 Android 특정 구현을 포함하는 단일 `randomUUID()` 함수를 생성합니다. 동일한 프로세스가 iOS에 대해서도 반복됩니다.

간단하게 설명하기 위해, 이 예시와 다음 예시에서는 "common", "ios", "android"와 같은 간소화된 소스 세트 이름을 사용합니다. 일반적으로 이는 `commonMain`, `iosMain`, `androidMain`을 의미하며, 유사한 로직은 테스트 소스 세트인 `commonTest`, `iosTest`, `androidTest`에서도 정의될 수 있습니다.

`expect`/`actual` 함수와 유사하게, `expect`/`actual` 프로퍼티는 다른 플랫폼에서 다른 값을 사용할 수 있도록 합니다. `expect`/`actual` 함수와 프로퍼티는 간단한 경우에 가장 유용합니다.

## 공통 코드의 인터페이스

플랫폼별 로직이 너무 크고 복잡하다면, 공통 코드에서 이를 나타내는 인터페이스를 정의하고 플랫폼 소스 세트에서 다른 구현을 제공하여 코드를 단순화할 수 있습니다.

![인터페이스 사용](expect-interfaces.svg){width=700}

플랫폼 소스 세트의 구현은 해당 종속성을 사용합니다.

```kotlin
// In the commonMain source set:
interface Platform {
    val name: String
}
```

```kotlin
// In the androidMain source set:
import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android ${Build.VERSION.SDK_INT}"
}
```

```kotlin
// In the iosMain source set:
import platform.UIKit.UIDevice

class IOSPlatform : Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}
```

공통 인터페이스가 필요할 때 적절한 플랫폼 구현을 주입하기 위해, 다음 옵션 중 하나를 선택할 수 있으며, 각 옵션은 아래에서 더 자세히 설명됩니다.

*   [`expect`/`actual` 함수 사용](#expected-and-actual-functions)
*   [다른 진입점을 통해 구현 제공](#different-entry-points)
*   [의존성 주입 프레임워크 사용](#dependency-injection-framework)

### `expect`/`actual` 함수

이 인터페이스의 값을 반환하는 `expect` 함수를 정의한 다음, 해당 서브클래스를 반환하는 `actual` 함수를 정의합니다.

```kotlin
// In the commonMain source set:
interface Platform

expect fun platform(): Platform
```

```kotlin
// In the androidMain source set:
class AndroidPlatform : Platform

actual fun platform() = AndroidPlatform()
```

```kotlin
// In the iosMain source set:
class IOSPlatform : Platform

actual fun platform() = IOSPlatform()
```

공통 코드에서 `platform()` 함수를 호출하면 `Platform` 타입의 객체와 함께 작동할 수 있습니다.
이 공통 코드를 Android에서 실행하면 `platform()` 호출은 `AndroidPlatform` 클래스의 인스턴스를 반환합니다.
iOS에서 실행하면 `platform()`은 `IOSPlatform` 클래스의 인스턴스를 반환합니다.

### 다른 진입점

진입점(entry point)을 제어하는 경우, `expect`/`actual` 선언을 사용하지 않고 각 플랫폼 아티팩트의 구현을 구성할 수 있습니다. 이를 위해서는 공유 Kotlin Multiplatform 모듈에 플랫폼 구현을 정의하되, 플랫폼 모듈에서 인스턴스화해야 합니다.

```kotlin
// Shared Kotlin Multiplatform module
// In the commonMain source set:
interface Platform

fun application(p: Platform) {
    // application logic
}
```

```kotlin
// In the androidMain source set:
class AndroidPlatform : Platform
```

```kotlin
// In the iosMain source set:
class IOSPlatform : Platform
```

```kotlin
// In the androidApp platform module:
import android.app.Application
import mysharedpackage.*

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        application(AndroidPlatform())
    }
}
```

```Swift
// In the iosApp platform module (in Swift):
import shared

@main
struct iOSApp : App {
    init() {
        application(IOSPlatform())
    }
}
```

Android에서는 `AndroidPlatform` 인스턴스를 생성하여 `application()` 함수에 전달해야 하며, iOS에서도 유사하게 `IOSPlatform` 인스턴스를 생성하여 전달해야 합니다. 이러한 진입점은 애플리케이션의 실제 진입점일 필요는 없지만, 공유 모듈의 특정 기능을 호출할 수 있는 지점입니다.

`expect`/`actual` 함수를 사용하거나 진입점을 통해 직접 올바른 구현을 제공하는 방식은 간단한 시나리오에 잘 작동합니다. 그러나 프로젝트에서 의존성 주입(DI) 프레임워크를 사용하는 경우, 일관성을 위해 간단한 경우에도 해당 프레임워크를 사용하는 것을 권장합니다.

### 의존성 주입 프레임워크

최신 애플리케이션은 일반적으로 느슨하게 결합된 아키텍처를 만들기 위해 의존성 주입(DI) 프레임워크를 사용합니다. DI 프레임워크는 현재 환경에 따라 컴포넌트에 의존성을 주입할 수 있도록 합니다.

Kotlin Multiplatform를 지원하는 모든 DI 프레임워크는 서로 다른 플랫폼에 대해 다른 의존성을 주입하는 데 도움이 될 수 있습니다.

예를 들어, [Koin](https://insert-koin.io/)은 Kotlin Multiplatform를 지원하는 의존성 주입 프레임워크입니다.

```kotlin
// In the common source set:
import org.koin.dsl.module

interface Platform

expect val platformModule: Module
```

```kotlin
// In the androidMain source set:
class AndroidPlatform : Platform

actual val platformModule: Module = module {
    single<Platform> {
        AndroidPlatform()
    }
}
```

```kotlin
// In the iosMain source set:
class IOSPlatform : Platform

actual val platformModule = module {
    single<Platform> { IOSPlatform() }
}
```

여기서 Koin DSL은 주입을 위한 컴포넌트를 정의하는 모듈을 생성합니다. 공통 코드에서 `expect` 키워드를 사용하여 모듈을 선언한 다음, `actual` 키워드를 사용하여 각 플랫폼에 대한 플랫폼별 구현을 제공합니다. 프레임워크는 런타임에 올바른 구현을 선택하는 것을 처리합니다.

DI 프레임워크를 사용할 때는 모든 의존성을 이 프레임워크를 통해 주입합니다. 동일한 논리가 플랫폼 의존성을 처리하는 데에도 적용됩니다. 프로젝트에 이미 DI가 있는 경우, `expect`/`actual` 함수를 수동으로 사용하는 것보다 DI를 계속 사용하는 것이 좋습니다. 이렇게 하면 두 가지 다른 의존성 주입 방식이 혼합되는 것을 피할 수 있습니다.

또한, 공통 인터페이스를 항상 Kotlin으로 구현할 필요는 없습니다. Swift와 같은 다른 언어로 다른 _플랫폼 모듈_에서 구현할 수 있습니다. 이 방법을 선택하는 경우, iOS 플랫폼 모듈에서 DI 프레임워크를 사용하여 구현을 제공해야 합니다.

![의존성 주입 프레임워크 사용](expect-di-framework.svg){width=700}

이 접근 방식은 구현을 플랫폼 모듈에 넣을 경우에만 작동합니다. Kotlin Multiplatform 모듈이 자급자족할 수 없으며 다른 모듈에서 공통 인터페이스를 구현해야 하므로 확장성이 좋지 않습니다.

<!-- If you're interested in having this functionality expanded to a shared module, please vote for this issue in Youtrack and describe your use case. -->

## 다음 단계

*   [KMP 앱에서 플랫폼별 API 사용](https://youtu.be/bSNumV04y_w) 동영상 안내를 시청하세요.
*   `expect`/`actual` 메커니즘에 대한 더 많은 예시 및 정보는 [`expect`/`actual` 선언](multiplatform-expect-actual.md)을 참조하세요.