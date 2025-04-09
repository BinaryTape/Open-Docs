---
title: "Kotlin Multiplatform 의존성 주입 (Dependency Injection)"
---
## 소스 프로젝트

:::info
 Kotlin Multiplatform 프로젝트는 다음 링크에서 확인할 수 있습니다: https://github.com/InsertKoinIO/hello-kmp
:::

## Gradle 의존성

Koin은 순수 Kotlin 라이브러리이며 공유 Kotlin 프로젝트에서 사용할 수 있습니다. 핵심 의존성만 추가하면 됩니다:

공통 프로젝트에 `koin-core`를 추가하고, 다음과 같이 의존성을 선언하세요: [https://github.com/InsertKoinIO/hello-kmp/tree/main/buildSrc](https://github.com/InsertKoinIO/hello-kmp/blob/main/buildSrc/src/main/java/Dependencies.kt)

```kotlin
// Dependencies.kt

object Versions {
    const val koin = "3.2.0"
}

object Deps {

    object Koin {
        const val core = "io.insert-koin:koin-core:${Versions.koin}"
        const val test = "io.insert-koin:koin-test:${Versions.koin}"
        const val android = "io.insert-koin:koin-android:${Versions.koin}"
    }

}
```

## 공유 Koin 모듈

플랫폼별 컴포넌트는 여기에 선언하여 Android 또는 iOS에서 나중에 사용할 수 있습니다 (actual 클래스 또는 actual 모듈로 직접 선언).

공유 모듈 소스는 다음 링크에서 확인할 수 있습니다: https://github.com/InsertKoinIO/hello-kmp/tree/main/shared

```kotlin
// platform Module
val platformModule = module {
    singleOf(::Platform)
}

// KMP Class Definition
expect class Platform() {
    val name: String
}

// iOS
actual class Platform actual constructor() {
    actual val name: String =
        UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}

// Android
actual class Platform actual constructor() {
    actual val name: String = "Android ${android.os.Build.VERSION.SDK_INT}"
}
```

Koin 모듈은 함수를 통해 수집해야 합니다:

```kotlin
// Common App Definitions
fun appModule() = listOf(commonModule, platformModule)
```

## Android 앱

`koin-android` 기능을 계속 사용하고 공통 모듈/클래스를 재사용할 수 있습니다.

Android 앱 코드는 다음 링크에서 확인할 수 있습니다: https://github.com/InsertKoinIO/hello-kmp/tree/main/androidApp

## iOS 앱

iOS 앱 코드는 다음 링크에서 확인할 수 있습니다: https://github.com/InsertKoinIO/hello-kmp/tree/main/iosApp

### Koin 호출

Koin 함수에 대한 래퍼(wrapper)를 공유 코드에서 준비해 보겠습니다:

```kotlin
// Helper.kt

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}
```

Main 앱 진입점에서 초기화할 수 있습니다:

```kotlin
@main
struct iOSApp: App {
    
    // KMM - Koin Call
    init() {
        HelperKt.doInitKoin()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### 주입된 클래스

Swift에서 Kotlin 클래스 인스턴스를 호출해 보겠습니다.

Kotlin 컴포넌트:

```kotlin
// Injection Boostrap Helper
class GreetingHelper : KoinComponent {
    private val greeting : Greeting by inject()
    fun greet() : String = greeting.greeting()
}
```

Swift 앱에서:

```kotlin
struct ContentView: View {
        // Create helper instance
    let greet = GreetingHelper().greet()

    var body: some View {
        Text(greet)
    }
}
```

### 새로운 Native Memory Management

루트 [gradle.properties](https://kotlinlang.org/docs/native-memory-manager.html)에서 실험적 기능을 활성화합니다.

    ```