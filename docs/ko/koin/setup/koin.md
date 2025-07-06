---
title: 코인
---

프로젝트에서 코인을 설정하는 데 필요한 모든 것

## 현재 버전

모든 코인 패키지는 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name)에서 찾을 수 있습니다.

현재 사용 가능한 코인 버전은 다음과 같습니다:

- Koin 안정 버전 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.0.3)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom) 
- Koin 불안정 버전 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom)

## Gradle 설정

### Kotlin

3.5.0 버전부터 BOM(Bill of Materials) 버전을 사용하여 모든 코인 라이브러리 버전을 관리할 수 있습니다. 앱에서 BOM을 사용하면, 코인 라이브러리 의존성에 버전을 별도로 추가할 필요가 없습니다. BOM 버전을 업데이트하면 사용하는 모든 라이브러리가 자동으로 새 버전으로 업데이트됩니다.

`koin-bom` BOM과 `koin-core` 의존성을 애플리케이션에 추가하세요: 
```kotlin
implementation(project.dependencies.platform("io.insert-koin:koin-bom:$koin_version"))
implementation("io.insert-koin:koin-core")
```
버전 카탈로그를 사용하는 경우:
```toml
[versions]
koin-bom = "x.x.x"
...

[libraries]
koin-bom = { module = "io.insert-koin:koin-bom", version.ref = "koin-bom" }
koin-core = { module = "io.insert-koin:koin-core" }
...
```
```kotlin
dependencies {
    implementation(project.dependencies.platform(libs.koin.bom))
    implementation(libs.koin.core)
}
```

또는 코인에 대한 정확한 의존성 버전을 지정하는 기존 방식을 사용하세요:
```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

이제 코인을 시작할 준비가 되었습니다:

```kotlin
fun main() {
    startKoin {
        modules(...)
    }
}
```

테스트 기능이 필요한 경우:

```groovy
dependencies {
    // Koin Test features
    testImplementation("io.insert-koin:koin-test:$koin_version")
    // Koin for JUnit 4
    testImplementation("io.insert-koin:koin-test-junit4:$koin_version")
    // Koin for JUnit 5
    testImplementation("io.insert-koin:koin-test-junit5:$koin_version")
}
```

:::info
이제 코인 튜토리얼을 통해 코인 사용법을 계속 학습할 수 있습니다: [Kotlin 앱 튜토리얼](/docs/quickstart/kotlin)
:::

### **Android**

Android 애플리케이션에 `koin-android` 의존성을 추가하세요:

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

이제 `Application` 클래스에서 코인을 시작할 준비가 되었습니다:

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        startKoin {
            modules(appModule)
        }
    }
}
```

추가 기능이 필요한 경우, 다음 필요한 패키지를 추가하세요:

```groovy
dependencies {
    // Java Compatibility
    implementation("io.insert-koin:koin-android-compat:$koin_android_version")
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager:$koin_android_version")
    // Navigation Graph
    implementation("io.insert-koin:koin-androidx-navigation:$koin_android_version")
    // App Startup
    implementation("io.insert-koin:koin-androidx-startup:$koin_android_version")
}
```

:::info
이제 코인 튜토리얼을 통해 코인 사용법을 계속 학습할 수 있습니다: [Android 앱 튜토리얼](/docs/quickstart/android-viewmodel)
:::

### **Jetpack Compose 또는 Compose Multiplatform**

멀티플랫폼 애플리케이션에 `koin-compose` 의존성을 추가하여 코인 및 Compose API를 사용하세요:

```groovy
dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

순수 Android Jetpack Compose를 사용하는 경우 다음을 사용할 수 있습니다:

```groovy
dependencies {
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
}
```

### **Kotlin Multiplatform**

멀티플랫폼 애플리케이션에 `koin-core` 의존성을 추가하여 공유 Kotlin 부분을 사용하세요:

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
이제 코인 튜토리얼을 통해 코인 사용법을 계속 학습할 수 있습니다: [Kotlin Multiplatform 앱 튜토리얼](/docs/quickstart/kmp)
:::

### **Ktor**

Ktor 애플리케이션에 `koin-ktor` 의존성을 추가하세요:

```groovy
dependencies {
    // Koin for Ktor 
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J Logger
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
}
```

이제 Ktor 애플리케이션에 코인 기능을 설치할 준비가 되었습니다:

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
이제 코인 튜토리얼을 통해 코인 사용법을 계속 학습할 수 있습니다: [Ktor 앱 튜토리얼](/docs/quickstart/ktor)
:::

### **코인 BOM**
코인 BOM(Bill of Materials)은 BOM 버전만 지정하여 모든 코인 라이브러리 버전을 관리할 수 있게 해줍니다. BOM 자체는 다양한 코인 라이브러리의 안정적인 버전에 대한 링크를 포함하고 있어, 이들이 함께 잘 작동하도록 합니다. 앱에서 BOM을 사용할 때는 코인 라이브러리 의존성에 버전을 별도로 추가할 필요가 없습니다. BOM 버전을 업데이트하면 사용하는 모든 라이브러리가 자동으로 새 버전으로 업데이트됩니다.

```groovy
dependencies {
    // Declare koin-bom version
    implementation platform("io.insert-koin:koin-bom:$koin_bom")
    
    // Declare the koin dependencies that you need
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")
    
    // If you need specify some version it's just point to desired version
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")
    
    // Works with test libraries too!
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}