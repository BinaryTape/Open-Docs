---
title: Koin
---

프로젝트에 Koin을 설정하는 데 필요한 모든 것

## 현재 버전

모든 Koin 패키지는 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name)에서 찾아볼 수 있습니다.

현재 사용 가능한 Koin 버전은 다음과 같습니다:

- Koin 안정(Stable) 버전 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.0.3)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom) 
- Koin 불안정(Unstable) 버전 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core/4.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-bom)

## Gradle 설정

### Kotlin

3.5.0 버전부터는 BOM 버전을 사용하여 모든 Koin 라이브러리 버전을 관리할 수 있습니다. 앱에서 BOM을 사용할 때는 Koin 라이브러리 의존성 자체에 버전을 추가할 필요가 없습니다. BOM 버전을 업데이트하면 사용 중인 모든 라이브러리가 자동으로 새 버전으로 업데이트됩니다.

애플리케이션에 `koin-bom` BOM과 `koin-core` 의존성을 추가하세요: 
```kotlin
implementation(project.dependencies.platform("io.insert-koin:koin-bom:$koin_version"))
implementation("io.insert-koin:koin-core")
```
버전 카탈로그(Version Catalogs)를 사용하는 경우:
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

또는 Koin의 정확한 의존성 버전을 명시하는 기존 방식을 사용하세요:
```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

이제 Koin을 시작할 준비가 되었습니다:

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
    // Koin 테스트 기능
    testImplementation("io.insert-koin:koin-test:$koin_version")
    // JUnit 4용 Koin
    testImplementation("io.insert-koin:koin-test-junit4:$koin_version")
    // JUnit 5용 Koin
    testImplementation("io.insert-koin:koin-test-junit5:$koin_version")
}
```

:::info
이제 Koin 튜토리얼을 통해 Koin 사용법을 계속 학습할 수 있습니다: [Kotlin 앱 튜토리얼](/docs/quickstart/kotlin)
:::

### **Android**

Android 애플리케이션에 `koin-android` 의존성을 추가하세요:

```groovy
dependencies {
    implementation("io.insert-koin:koin-android:$koin_android_version")
}
```

이제 `Application` 클래스에서 Koin을 시작할 준비가 되었습니다:

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

추가 기능이 필요한 경우, 아래의 필요한 패키지를 추가하세요:

```groovy
dependencies {
    // Java 호환성
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
이제 Koin 튜토리얼을 통해 Koin 사용법을 계속 학습할 수 있습니다: [Android 앱 튜토리얼](/docs/quickstart/android-viewmodel)
:::

### **Jetpack Compose 또는 Compose Multiplatform**

Koin 및 Compose API를 사용하려면 멀티플랫폼 애플리케이션에 `koin-compose` 의존성을 추가하세요:

```groovy
dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

순수 Android Jetpack Compose를 사용하는 경우 다음을 사용할 수 있습니다.

```groovy
dependencies {
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
}
```

### **Kotlin Multiplatform**

공유 Kotlin 파트를 위해 멀티플랫폼 애플리케이션에 `koin-core` 의존성을 추가하세요:

```groovy
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

:::info
이제 Koin 튜토리얼을 통해 Koin 사용법을 계속 학습할 수 있습니다: [Kotlin 멀티플랫폼 앱 튜토리얼](/docs/quickstart/kmp)
:::

### **Ktor**

Ktor 애플리케이션에 `koin-ktor` 의존성을 추가하세요:

```groovy
dependencies {
    // Ktor용 Koin
    implementation("io.insert-koin:koin-ktor:$koin_ktor")
    // SLF4J 로거
    implementation("io.insert-koin:koin-logger-slf4j:$koin_ktor")
}
```

이제 Ktor 애플리케이션에 Koin 기능을 설치할 준비가 되었습니다:

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
이제 Koin 튜토리얼을 통해 Koin 사용법을 계속 학습할 수 있습니다: [Ktor 앱 튜토리얼](/docs/quickstart/ktor)
:::

### **Koin BOM**
Koin Bill of Materials (BOM)을 사용하면 BOM 버전만 지정하여 모든 Koin 라이브러리 버전을 관리할 수 있습니다. BOM 자체는 다양한 Koin 라이브러리의 안정적인 버전들로 연결되어 있어, 서로 잘 작동하도록 구성되어 있습니다. 앱에서 BOM을 사용할 때는 Koin 라이브러리 의존성 자체에 버전을 추가할 필요가 없습니다. BOM 버전을 업데이트하면 사용 중인 모든 라이브러리가 자동으로 새 버전으로 업데이트됩니다.

```groovy
dependencies {
    // koin-bom 버전 선언
    implementation platform("io.insert-koin:koin-bom:$koin_bom")
    
    // 필요한 koin 의존성 선언
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")
    
    // 특정 버전이 필요한 경우 원하는 버전을 직접 지정하면 됩니다.
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")
    
    // 테스트 라이브러리도 지원합니다!
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}